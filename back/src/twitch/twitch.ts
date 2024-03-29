import { RefreshingAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { User } from "../entity/User";
import { dataSource } from "../database";
import { environment } from "../utils/environment";
import { logger } from "../utils/logger";


export const clientId = environment.TWITCH_CLIENTID;
export const ownerId = environment.TWITCH_OWNERID;
export const secret = environment.TWITCH_SECRET;
export const clientSecret = environment.TWITCH_CLIENTSECRET;
export const redirectUri = environment.TWITCH_REDIRECT_URI;

const authParams = new URLSearchParams({
	response_type: 'code',
	client_id: clientId,
	redirect_uri: redirectUri,
	scope: 'user:read:broadcast user:read:email'
});

export const authURL = `https://id.twitch.tv/oauth2/authorize?${authParams}`;

export const authProvider = new RefreshingAuthProvider({clientId, clientSecret});
authProvider.onRefresh((user, token)=>{
	dataSource.manager.update(User, {
		twitchId: user
	},{
		twitchToken: token
	});
});
authProvider.onRefreshFailure((user)=>{
	logger.error(`Twitch token refresh failure for user ${user}`);
	try {
		authProvider.removeUser(user);
	}catch(e) {
		logger.error('Error removing user after refresh failure');
	}
});

/* Ensure user tokens are loaded from database */
export async function ensureUserReady(user: string) {
	if(!authProvider.hasUser(user)) {
		const u = await User.findOneByOrFail({ twitchId: user });
		authProvider.addUser(user, u.twitchToken);
	}
}

export const api = new ApiClient({authProvider, batchDelay: 50});

