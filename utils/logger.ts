import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, service }) => {
      return `[${timestamp}] ${service} ${level}: ${message}`;
    }),
  ),
  transports: [new transports.Console()],
  defaultMeta: {
    service: 'KreativeIdApi',
  },
});

export default logger;
