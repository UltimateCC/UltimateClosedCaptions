import express from 'express';
import { createServer } from 'node:http';
import { endSocketSessions, io } from './socketioServer';
import { apiRouter } from './api/apiRoutes';
import { rateLimiterMiddleware } from './middleware/rateLimit';
import { environment } from './utils/environment';
import { logger } from './utils/logger';
import { initSessionMiddleware, sessionMiddleware, stopSessionMiddleware } from './middleware/session';
import { eventsub } from './twitch/events';

const app = express();
app.set('trust proxy', true);

app.use(rateLimiterMiddleware);
eventsub.apply(app);
app.use(sessionMiddleware);
app.use(express.json());

// API routes
app.use('/api', apiRouter);

// Create HTTP server and attach express app
export const server = createServer(app);
// Attach socketio to server
io.attach(server);
io.engine.use(sessionMiddleware);

export async function startServer() {
	await initSessionMiddleware();
	await new Promise<void>((res)=>{
		server.listen(environment.PORT, ()=>{
			res();
		});
	});
	logger.info(`Server started on port ${ environment.PORT }`);
	await eventsub.markAsReady();
}

export async function stopServer() {
	await Promise.all([
		new Promise<void>((resolve, reject)=>{
			logger.info('Closing HTTP server');
			server.close((err)=>{
				if(err) reject(err);
				else resolve();
			});
		}),
		endSocketSessions()
	]);
	logger.info('Server closed');
	await stopSessionMiddleware();
}
