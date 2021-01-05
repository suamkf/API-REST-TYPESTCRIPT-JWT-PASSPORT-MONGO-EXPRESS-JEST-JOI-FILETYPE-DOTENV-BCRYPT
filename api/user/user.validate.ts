import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { logger } from "../../logger/logger";
import { getUserByEmailAndUsername } from "./user.controller";

const blueprintUser = Joi.object().keys({
  username: Joi.string().min(6).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

export const validateUserInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resultVaidationInfor = blueprintUser.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (resultVaidationInfor.error != undefined) {
    const errors = resultVaidationInfor.error.details.reduce(
      (acumulator, error) => {
        return `${acumulator}, ${error.message} `;
      },
      ""
    );

    const messageError = `Same error are ocurred please check and try again [${errors}]`;
    logger.warn(messageError);
    return res.status(400).send(messageError);
  }

  logger.info("Username, email and password have the correct format.");
  next();
};

export const checkUserInDataBase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByEmailAndUsername(
      req.body.email,
      req.body.username
    );
    if (user.length > 0) {
      const message = `Already exist user register with this username or email`;
      logger.info(message);
      return res.status(400).json({
        msg: `${message}. Please try again`,
      });
    }

    logger.info(
      `Username: ${req.body.username} and email: ${req.body.email} are free for registration`
    );
    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error,
    });
  }
};

export const checkRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByEmailAndUsername(
      req.body.email,
      req.body.username,
    );
    if (user.length > 0) {
      logger.info(
        `User witn email: ${req.body.email} is registered in data base`
      );
      return next();
    }
    logger.warn(`User with email:${req.body.email} is not a register user.`);
    res.status(400).json({
      msg: `User with email:${req.body.email} is not a register user. Please go to singup section.`,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: `Internal server error.`,
    });
  }
};
