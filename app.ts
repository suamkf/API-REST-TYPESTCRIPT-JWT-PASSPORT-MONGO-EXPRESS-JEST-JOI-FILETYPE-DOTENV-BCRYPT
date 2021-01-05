import dotenv from "dotenv";
dotenv.config();
import exrpress from "express";
import bodyPaser from "body-parser";
import morgan from "morgan";
import { logger } from "./logger/logger";
import "./dataBase";
import auth from "./api/libs/auth";
import passport from "passport";
import userRouter from "./api/user/user.route";
import { devErrors, mongoErrors,prodErrors } from "./api/libs/errorHandler";
import { config } from "./config/index";


passport.use(auth);
const app = exrpress();

app.use(bodyPaser.json());
app.use(
  morgan("short", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(passport.initialize());
app.use("/api/users", userRouter);
app.use(mongoErrors)
if(config.env==="prod"){
  app.use(prodErrors);
}else{
  app.use(devErrors);
}

export default app;
