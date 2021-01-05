import express,{ Router, Request, Response } from "express";
import {
  validateUserInfo,
  checkUserInDataBase,
  checkRegisterUser,
} from "./user.validate";
import { errorHandler } from "../libs/errorHandler";
import {
  hashPassword,
  saveUser,
  hiddeCriticalData,
  createToken,
  getUserByEmailAndUsername,
  comparePassword,
} from "./user.controller";
import { logger } from "../../logger/logger";
import { IUser } from "./user.model";
import passport from "passport"

const userRouter = Router();
const jwtAuth = passport.authenticate("jwt", {session:false});

userRouter.post(
  "/singup",
  [validateUserInfo, checkUserInDataBase],
  errorHandler(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const username: string = req.body.username;
    const newUser = await saveUser(
      email,
      username,
      await hashPassword(req.body.password)
    );
    logger.info(`User create succesfully`);
    res.status(201).json({
      user: hiddeCriticalData(newUser),
      token: createToken(newUser),
    });
  })
);

userRouter.post(
  "/login",
  [checkRegisterUser],
  errorHandler(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const username: string = req.body.username;
    try {
      const user: Array<IUser> = await getUserByEmailAndUsername(email, username);
      console.log("llego")
      const equalPassword = await comparePassword(user[0], req.body.password);
      if (equalPassword) {
        logger.info(`User with email:${user[0].email} made login correctly`);
        return res.status(200).json({
          token: createToken(user[0]),
        });
      }
      logger.info(`User with email:${user[0].email} send a wrong password`);
      res.status(400).json({
        msg: `Wrong password please check and try again`,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        msg: `Internal server error`,
      });
    }
  })
);

userRouter.get("/whoami", [jwtAuth], (req:Request ,res:Response)=>{
  const user  = req.user;
  res.status(200).json({
    user,
  })
})
export default userRouter;
