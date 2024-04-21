import SuperTokens from "supertokens-node";
import Session, { SessionContainer } from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { environment } from "../utils/environment";
import { clientId, clientSecret } from "../twitch/twitch";
import { logger } from "../utils/logger";
import { User } from "../entity/User";

export function initSuperTokens() {
	SuperTokens.init({
		framework: "express",
		supertokens: {
			connectionURI: environment.SUPERTOKENS_URL,
		},
		appInfo: {
			appName: "UltimateCC",
			apiDomain: environment.APP_DOMAIN,
			websiteDomain: environment.APP_DOMAIN,
			apiBasePath: "/api/auth",
		},
		recipeList: [
			ThirdParty.init({
				signInAndUpFeature: {
					providers: [{
						config: {
							thirdPartyId: "twitch",
							clients: [{
								clientId,
								clientSecret,
								scope: ['user:read:broadcast','user:read:email']
							}],
							oidcDiscoveryEndpoint: "https://id.twitch.tv/oauth2",
						},
						override: (originalImplementation) => {
							return {
								...originalImplementation,
								getUserInfo: async function (input) {
									const res = await fetch('https://api.twitch.tv/helix/users', {
										headers: {
											"Authorization": `Bearer ${input.oAuthTokens?.access_token}`,
											"Client-Id": clientId
										}
									});
									if(!res.ok) {
										throw new Error('Twitch error getting user info');
									}
									const data = (await res.json()).data[0];

									return {
										thirdPartyUserId: data.id,
										email: {
											id: data.email,
											isVerified: true
										},
										rawUserInfoFromProvider: {
											fromUserInfoAPI: data,
										}
									}
								}
							}
						}

					}]
				},

				override: {
					functions: (originalImplementation) => {
						return {
							...originalImplementation,
							signInUp: async function (input) {
								const res = await originalImplementation.signInUp(input);
								if(res.status !== 'OK') {
									logger.error('Supertoken signin error', res);
								}else{
									const twitchInfo = res.rawUserInfoFromProvider.fromUserInfoAPI;

									// Save twitch user info
									let user = await User.findOneBy({ twitchId: twitchInfo?.id });
									if(!user) {
										user = new User();
										user.twitchId = twitchInfo?.id;
									}
									user.userId = res.user.id;
									user.twitchLogin = twitchInfo?.login;
									user.twitchName = twitchInfo?.display_name;
									user.img = twitchInfo?.profile_image_url;
									user.email = twitchInfo?.email ?? '';

									const { scope, access_token: accessToken, refresh_token: refreshToken } = res.oAuthTokens;

									// if(twitchInfo?.id === ownerId && scope?.includes('analytics:read:extensions')) {
									// 	logger.info('Owner authenticated without analytics:read:extensions scope, not saving token');
									// }else{
										user.twitchToken = {
											accessToken,
											refreshToken,
											scope,
											expiresIn: 0,
											obtainmentTimestamp: 0
										};
									//}
									await user.save();
								}
								return res;
							}
						}
					}
				}
			}),
			Session.init(),
			Dashboard.init(),
			UserRoles.init(),
		]
	});

}

export async function isAdminSession(session: SessionContainer) {
	const roles = await session.getClaimValue(UserRoles.UserRoleClaim);
	return roles?.includes('admin') ?? false;
}