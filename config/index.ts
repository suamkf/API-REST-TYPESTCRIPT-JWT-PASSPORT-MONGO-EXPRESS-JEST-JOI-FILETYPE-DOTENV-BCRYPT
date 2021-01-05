import path from "path";
import { devConfig } from "./devConfig";
import { prodConfig } from "./prodConfig";

export const config = {
  server: {
    port: process.env.PORT || 5000,
  },
  winston: {
    dirname: path.join(__dirname, `../logger`),
    filename: "log.log",
    maxFiles: 5,
    maxsize: 5120000,
  },
  mongo: {
    uri:
      process.env.MONGO_URI ||
      "mongodb://localhost/TypeScriptNodeMongoJwtLoggerJoiPassportDotenv",
    userCollection: "users",
  },
  bcrypt: {
    saltOrRound: process.env.SALT_OR_ROUND || "10",
  },
  jwt: {
    secretOrKey:"",
    expiredIn: "24h",
  },
  env: process.env.ENV || "dev",
};

switch (config.env) {
  case "dev":
    config.jwt = {
      ...config.jwt,
      ...devConfig.jwt,
    };
    break;
  case "prod":
    config.jwt = {
      ...config.jwt,
      ...prodConfig.jwt,
    };
    break;

  default:
    config.jwt = {
      ...config.jwt,
      ...devConfig.jwt,
    };
    break;
}
