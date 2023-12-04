import { Server, Socket } from "socket.io";
import { Action, CaptionsStatus, Info, LangList, TranscriptData } from "./types";
import { User, UserConfig } from "./entity/User";
import { getTranslator } from "./translate/getTranslator";
import { Translator } from "./translate/Translator";
import { StreamingSpeechToText } from "./streamingStt/StreamingSpeechToText";
import { getStreamingStt } from "./streamingStt/getStreamingStt";
import { Stats } from "./entity/Stats";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { isExtensionInstalled, sendPubsub } from "./twitch/extension";
import { logger } from "./logger";


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
	audioStart: ()  => void;
	audioData: (data: Buffer)  => void;
	audioEnd: ()  => void;
}

export interface SocketData {
	startTime: number;
	stats: Stats | null;
	config: UserConfig;
	twitchId: string;
	translator: Translator;
	streamingStt: StreamingSpeechToText | null;
}

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

// Limit config reloads
const loadRateLimiter = new RateLimiterMemory({
	points: 2,
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
	const u = await User.findOneByOrFail({ twitchId: socket.data.twitchId });
	socket.data.config = u.config;

	//Init statistics
	socket.data.stats = new Stats();
	socket.data.startTime = Date.now();
	socket.data.stats.user = u;
	socket.data.stats.twitchId = u.twitchId;
	socket.data.stats.config = socket.data.config;

	// Streaming speech to text
	await socket.data.streamingStt?.stop();
	socket.data.streamingStt = getStreamingStt(u);
	socket.data.streamingStt?.on('transcript', transcript=>{
		handleCaptions(socket, transcript);
	});
	socket.data.streamingStt?.on('info', info => {
		socket.emit('info', info);
	});

	// Translation
	socket.data.translator = getTranslator(u);

	// Send available translation languages
	const langs = await socket.data.translator.getLangs();
	socket.emit('translateLangs', langs);

	sendStatus(socket);
}

async function endSession(socket: TypedSocket) {
	socket.data.streamingStt?.stop();
	// Save statistics if necessary
	if(socket.data.stats?.finalCount || socket.data.stats?.partialCount) {
		// Remove stats from socket data before to avoid race condition (double save)
		const stats = socket.data.stats;
		socket.data.stats = null;
		stats.duration = Date.now() - socket.data.startTime;
		stats.translatedCharCount = socket.data.translator.getTranslatedChars();
		await stats.save();
		logger.debug('Saved stats for '+socket.data.twitchId);
	}
}

async function sendStatus(socket: TypedSocket) {
	socket.emit('status', {
		stt: socket.data.streamingStt?.ready() ?? false,
		translation: socket.data.translator.ready(),
		twitch: await isExtensionInstalled(socket.data.twitchId)
	});
}

async function handleCaptions(socket: TypedSocket, transcript: TranscriptData ) {
	try {
		await textRateLimiter.consume(socket.data.twitchId);

		if(transcript.text.length > 1000) {
			logger.warn('Dropping too long transcript for user '+socket.data.twitchId);
			return;
		}

		socket.emit('transcript', transcript );

		// Save statistics
		if(socket.data.stats) {
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
			if(socket.data.stats) {
				socket.data.stats.translateErrorCount++;
			}
		}else{
			// If translation generated errors, warn user
			if(out.errors?.length) {
				if(socket.data.stats) {
					socket.data.stats.translateErrorCount += out.errors.length;
				}
				// If multiple translation errors, it's probably multiple times the same
				// -> Send only first one to user
				socket.emit('info', { type: 'warn', message: out.errors[0] });
			}

			try{
				logger.debug('Sending pubsub for '+socket.data.twitchId, out.data);
				await sendPubsub(socket.data.twitchId, JSON.stringify(out.data));
			}catch(e: any) {
				if(e?.statusCode === 422) {
					// Simplify error when pubsub message is too large
					// todo: If this is correctly detected, show message to user
					logger.warn('Pubsub message too large for user '+socket.data.twitchId);
				}else{
					throw e;
				}
			}
		}
	}catch(e) {
		logger.error('Error handling captions', e);
	}
}

export function initSocketioServer(io: TypedServer) {

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
			next(new Error('not authenticated'));
		}
	});

	io.on('connect', (socket) => {
		socket.join('twitch-'+socket.data.twitchId);

		socket.on('disconnect', ()=>{
			endSession(socket)
				.catch(e=>logger.error('Error ending session', e));
		});

		socket.on('reloadConfig', ()=>{
			loadConfig(socket).catch(e=>logger.error('Error reloading config', e));
		});

		// Text direclty received
		socket.on('text', captions =>{
			handleCaptions(socket, captions).catch(e=>{
				logger.error('Error handling captions', e);
			});
		});

		// Streaming speech to text
		socket.on('audioStart', ()=>{
			socket.data.streamingStt?.start();
		});
		socket.on('audioEnd', ()=>{
			socket.data.streamingStt?.stop();
		});
		socket.on('audioData', (data)=>{
			socket.data.streamingStt?.handleData(data);
		});
	});
}

export async function endSocketSessions(io: TypedServer) {
	// Only local sockets are fetched
	// -> socket type can be used
	const sockets = await io.local.fetchSockets() as unknown as TypedSocket[];
	// End all sessions (triggers saving statistics)
	await Promise.all(sockets.map(s=>endSession(s)));
	logger.info('All sockets disconnected');
}