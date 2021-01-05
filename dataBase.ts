import mongoose from "mongoose";
import { config } from "./config/index";
import { logger } from "./logger/logger";

mongoose.connect(config.mongo.uri, {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once("open", () => {
  logger.info(`Server connected with mondoDB ${config.mongo.uri}`);
});
mongoose.connection.on(`error`, () => {
  logger.error("fail to connect con Mogno DB");
  process.exit(1);
});
