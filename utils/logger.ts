import * as winston from "winston";

const logger = winston.createLogger({
  format: winston.format.printf((info) =>
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: info.level,
      message: info.message,
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;
