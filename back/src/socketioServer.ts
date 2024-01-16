import { Server, Socket } from "socket.io";
import { Action, CaptionsStatus, Info, LangList, TranscriptData, TranscriptAlt } from "./types";
import { User, UserConfig } from "./entity/User";
import { getTranslator } from "./translate/getTranslator";
import { Translator } from "./translate/Translator";
import { Stats } from "./entity/Stats";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { isExtensionInstalled, sendPubsub } from "./twitch/extension";
import { logger } from "./logger";
import { eventsub } from "./twitch/events";


interface ServerToClientEvents {
	translateLangs: (langs: LangList) => void;
	status: ( status: CaptionsStatus ) => void;
	info: ( info: Info )=>void;
	transcript: ( transcript: TranscriptData )=>void;
	action: (action: Action)=>void;
}

interface ClientToServerEvents {
	reloadConfig: () => void;
	text: (text: TranscriptData) => void;
	/*
	audioStart: ()  => void;
	audioData: (data: Buffer)  => void;
	audioEnd: ()  => void;
	*/
}

export interface SocketData {
	firstText: number
	lastText: number
	lastSpokenLang: string
	stats: Stats | null
	config: UserConfig
	twitchId: string
	translator: Translator
	//streamingStt: StreamingSpeechToText | null;
}

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

// Limit config reloads
const loadRateLimiter = new RateLimiterMemory({
	points: 3,
	duration: 1,
});

// Limit received text
const textRateLimiter = new RateLimiterMemory({
	points: 10,
	duration: 5,
});

async function loadConfig(socket: TypedSocket) {
	// End previous session if there was one
	await endSession(socket);

	// Ratelimit
	await loadRateLimiter.consume(socket.data.twitchId);

	// Fetch user
	const u = await User.findOneOrFail({where: { twitchId: socket.data.twitchId }, cache: false});
	socket.data.config = u.config;

	if(socket.data.config.twitchAutoStop !== false) {
		registerTwitchAutoStop(u.twitchId);
	}

	//Init statistics
	socket.data.stats = new Stats();
	socket.data.stats.twitchId = u.twitchId;
	socket.data.stats.config = socket.data.config;

	// Streaming speech to text
	/*
	await socket.data.streamingStt?.stop();
	socket.data.streamingStt = getStreamingStt(u);
	socket.data.streamingStt?.on('transcript', transcript=>{
		handleCaptions(socket, transcript);
	});
	socket.data.streamingStt?.on('info', info => {
		socket.emit('info', info);
	});*/

	// Translation
	socket.data.translator = getTranslator(u);
	await socket.data.translator.init();

	// Send available translation languages
	const langs = await socket.data.translator.getLangs();
	socket.emit('translateLangs', langs);

	sendStatus(socket);
}

async function endSession(socket: TypedSocket) {
	//socket.data.streamingStt?.stop();
	// Save statistics if necessary
	if(socket.data.stats?.finalCount || socket.data.stats?.partialCount) {
		// Remove stats from socket data before to avoid race condition (double save)
		const stats = socket.data.stats;
		socket.data.stats = null;
		stats.duration = socket.data.lastText - socket.data.firstText;
		stats.translatedCharCount = socket.data.translator.getTranslatedChars();
		stats.translateErrorCount = socket.data.translator.getErrorCount();
		await stats.save();
		logger.debug('Saved stats for '+socket.data.twitchId);
	}
}

async function sendStatus(socket: TypedSocket) {
	socket.emit('status', {
		stt: /*socket.data.streamingStt?.ready() ??*/ false,
		translation: socket.data.translator.ready(),
		twitch: await isExtensionInstalled(socket.data.twitchId)
	});
}

async function handleCaptions(socket: TypedSocket, transcript: TranscriptData ) {
	try {
		// Ratelimit
		try {
			await textRateLimiter.consume(socket.data.twitchId);
		}catch(e) {
			logger.warn('Transcript ratelimited for: '+socket.data.twitchId);
			return;
		}

		// Ignore empty string (in theory should not happen)
		if(transcript.text.length === 0) {
			logger.warn('Received empty transcript for: '+socket.data.twitchId);
			return;
		}

		// Limit too long text
		// (Text shouldnt be this long because it is splitted clientside)
		if(transcript.text.length > 250) {
			logger.warn('Dropping too long transcript for: '+socket.data.twitchId);
			return;
		}

		socket.emit('transcript', transcript );

		socket.data.lastSpokenLang = transcript.lang;

		// Count statistics
		if(socket.data.stats) {
			const now = Date.now();
			if(!socket.data.firstText) {
				socket.data.firstText = now - transcript.duration;
			}
			socket.data.lastText = now;

			if(transcript.final) {
				socket.data.stats.finalCount++;
				socket.data.stats.finalCharCount += transcript.text.length;
			}else{
				socket.data.stats.partialCount++;
				socket.data.stats.partialCharCount += transcript.text.length;
			}
		}

		const out = await socket.data.translator.translate(transcript);
		if(out.isError) {
			socket.emit('info', { type: 'warn', message: out.message });
			logger.error('Translation failed for '+socket.data.twitchId, out.message);
		}else{
			// If translation generated errors, warn user
			if(out.errors?.length) {
				// If multiple translation errors, it's probably multiple times the same
				// -> Send only first one to user
				const message = out.errors[0];
				// Do not send errors 500+ to users to avoid confusion
				if(!message.startsWith('Translation API error: 50')) {
					socket.emit('info', { type: 'warn', message });
				}
				logger.warn('Translation error for '+socket.data.twitchId+' : '+message);
			}
			try{
				logger.debug('Sending pubsub for '+socket.data.twitchId, out.data);

				// If not in production, add fake translate for free to captions for testing
				if(process.env.NODE_ENV !== 'production') {
					const fakeTranslatorContent: TranscriptAlt[] = [
						...out.data.captions,
						{
							text: transcript.text,
							lang: "test"
						}
					]
					out.data.captions = fakeTranslatorContent;
				}

				// todo for metrics:
				// Get delay at this step
				await sendPubsub(socket.data.twitchId, JSON.stringify(out.data));
			}catch(e: any) {
				if(e?.statusCode === 422) {
					logger.warn('Pubsub message too large for user '+socket.data.twitchId);
				}else if(e?.statusCode === 500) {
					logger.warn('Error 500 sending pubsub for user '+socket.data.twitchId);
				}else{
					throw e;
				}
			}
		}
	}catch(e) {
		logger.error('Error handling captions for '+socket.data.twitchId, e);
	}
}

export const io: TypedServer = new Server();

// Before actually accepting connection: auth + try loading config
io.use((socket, next)=>{
	const session = (socket.request as any).session;

	if(session.userid) {
		socket.data.twitchId = session.userid;
		loadConfig(socket).then(()=>{
			next();
		})
		.catch((e=>{
			logger.error('Error loading user config', e);
			next(new Error('error loading user config'));
		}));

	}else{
		logger.warn('Unauthenticated socketio connection');
		next(new Error('not authenticated'));
	}
});

// When socket connected
io.on('connect', (socket) => {
	socket.join('twitch-'+socket.data.twitchId);

	socket.on('disconnect', ()=>{
		endSession(socket).catch(e=>logger.error('Error ending session', e));
	});

	socket.on('reloadConfig', ()=>{
		loadConfig(socket).catch(e=>logger.error('Error reloading config', e));
	});

	socket.on('text', captions =>{
		// Ignore if data is invalid
		if(typeof captions.text !== 'string') return;
		if(typeof captions.delay !== 'number') return;
		if(typeof captions.duration !== 'number') return;
		if(captions.duration < 0) return;
		if(typeof captions.lang !== 'string') return;
		if(typeof captions.final !== 'boolean') return;

		handleCaptions(socket, captions);
	});

	// Streaming speech to text
	/*
	socket.on('audioStart', ()=>{
		socket.data.streamingStt?.start();
	});
	socket.on('audioEnd', ()=>{
		socket.data.streamingStt?.stop();
	});
	socket.on('audioData', (data)=>{
		socket.data.streamingStt?.handleData(data);
	});*/
});

/** Gracefully disconnect all sockets (called at shutdown) */
export async function endSocketSessions() {
	// Only local sockets are fetched
	// -> socket type can be used
	const sockets = await io.local.fetchSockets() as unknown as TypedSocket[];
	// End all sessions (triggers saving statistics)
	await Promise.all(sockets.map(s=>endSession(s)));
	logger.info('All sockets sessions ended');
}

export async function getUserSockets(twitchId: string) {
	// Only local sockets are fetched
	// -> socket type can be used
	return await io.local.in('twitch-'+twitchId).fetchSockets() as unknown as TypedSocket[];
}

export async function isConnected(twitchId: string) {
	const sockets = await getUserSockets(twitchId);
	return !!sockets.length;
}

export function registerTwitchAutoStop(twitchId: string) {
	eventsub.onStreamOffline(twitchId, async()=>{
		try {
			const sockets = await getUserSockets(twitchId);
			for(const socket of sockets) {
				if(socket.data.config.twitchAutoStop !== false) {
					socket.emit('action', { type:'stop' });
				}
			}
		}catch(e) {
			logger.warn('Error fetching sockets for twitch autostop ', e);
		}
	});
}