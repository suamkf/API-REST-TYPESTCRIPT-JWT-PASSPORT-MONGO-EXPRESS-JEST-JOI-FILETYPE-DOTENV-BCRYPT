import app from "./app"
import {config} from "./config/index"
import { logger } from "./logger/logger";

const server = app.listen(config.server.port, ()=>{
  logger.info(`Server is running on port ${config.server.port}`);
})