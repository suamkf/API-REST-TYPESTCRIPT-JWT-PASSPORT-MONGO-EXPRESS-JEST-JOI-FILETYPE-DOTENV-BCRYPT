import { createLogger, transports, format } from "winston";

import { config } from "../config/index";

const addDate = format((info) => {
  info.message = `${new Date().toISOString} ${info.mes}`;
  return info;
});

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      handleExceptions: true,
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      level: "debug",
      handleExceptions: true,
      format: format.combine(format.timestamp(), format.simple()),
      dirname: config.winston.dirname,
      filename: config.winston.filename,
      maxFiles: config.winston.maxFiles,
      maxsize: config.winston.maxsize,
    }),
  ],
});
