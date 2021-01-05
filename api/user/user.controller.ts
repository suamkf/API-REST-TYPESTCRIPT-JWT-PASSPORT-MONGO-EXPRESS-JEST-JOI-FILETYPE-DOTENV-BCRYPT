import User, { IUser } from "./user.model";
import bcrypt from "bcrypt";
import { config } from "../../config/index";
import { logger } from "../../logger/logger";
import { sign } from "jsonwebtoken";

export const getUserById = (_id: string) => {
  return User.findOne({ _id });
};

export const getUserByEmailAndUsername = (email: string, username: string) => {
  email =  email ? email : "1";
  username =  username ? username : "1";
  return User.find({ $or: [{ email }, { username }] });
};

export const saveUser = (email: string, username: string, password: string) => {
  logger.info("Creating a new user");
  return new User({ username, email, password }).save();
};
export const hashPassword = (password: string) => {
  logger.info("hashing a password");
  return bcrypt.hash(password, parseInt(config.bcrypt.saltOrRound));
};

export const hiddeCriticalData = (user: IUser) => {
  return {
    _id: user.id,
    username: user.username,
    email: user.email,
    status: user.state,
    created_at: user.created_at,
  };
};

export const createToken = (user: IUser) => {
  return sign({ _id: user._id }, config.jwt.secretOrKey, {
    expiresIn: config.jwt.expiredIn,
  });
};

export const comparePassword = (user: IUser, password:string)=>{
  console.log(`user pass: ${user.password} send pass:${password}`)
  return bcrypt.compare(password,user.password);
}
