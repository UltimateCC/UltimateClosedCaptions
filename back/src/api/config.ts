
import { Router } from "express";
import { dataSource } from "../database";
import { User, UserConfigSchema, UserSecretsSchema } from "../entity/User";
import { authMiddleware } from "./auth";

export const configRouter = Router();

configRouter.get('', authMiddleware, async (req, res, next)=>{
	try{
		let user = await dataSource.manager.findOneByOrFail(User, { twitchId: req.session.userid});
		res.json(user.config);
	}catch(e) {
		next(e);
	}
});

configRouter.post('', authMiddleware, async (req, res, next)=>{
	try{
		const user = await dataSource.manager.findOneByOrFail(User, {twitchId: req.session.userid});
		const config = UserConfigSchema.partial().parse(req.body);
		Object.assign(user.config, config);
		await dataSource.manager.save(user);
		res.json(user.config);
	}catch(e) {
		next(e);
	}
});
