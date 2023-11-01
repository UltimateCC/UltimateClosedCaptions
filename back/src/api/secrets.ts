
import { Router } from "express";
import { dataSource } from "../database";
import { User, UserConfigSchema, UserSecretsSchema } from "../entity/User";
import { authMiddleware } from "./auth";

export const secretsRouter = Router();


secretsRouter.post('', authMiddleware, async (req, res, next)=>{
	try{
		const user = await dataSource.manager.findOneByOrFail(User, {twitchId: req.session.userid});
		Object.assign(user.secrets, UserSecretsSchema.parse(req.body));
		await dataSource.manager.save(user);
		res.json({success: true});
	}catch(e) {
		next(e);
	}
});
