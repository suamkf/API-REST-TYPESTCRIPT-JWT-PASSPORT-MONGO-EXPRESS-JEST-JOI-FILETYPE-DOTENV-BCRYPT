import { ExtractJwt,  Strategy, StrategyOptions } from "passport-jwt";
import { config } from "../../config/index";
import { getUserById, hiddeCriticalData } from "../user/user.controller";
import { logger } from "../../logger/logger";

const jwtOptions:StrategyOptions  ={
    secretOrKey: config.jwt.secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

export default new Strategy(jwtOptions, async(Payload, next)=>{
 try {
     const user = await getUserById(Payload._id);
     if(user){
         logger.info(`User with username: ${user.username} provided a valid token`);
       return  next(null,hiddeCriticalData(user));
     }
     logger.warn(`User with username: ${user.userame} do not exists in data base.`)
     next(null, false);
 } catch (error) {
     logger.error(error);
 }
})