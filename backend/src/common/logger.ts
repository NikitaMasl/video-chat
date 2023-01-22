import winston, { format } from 'winston';

const { combine, timestamp, simple } = format;

const transports: any[] = [];

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        format((info) => {
            // eslint-disable-next-line no-param-reassign
            info.message = `Log ${info.level} on backend:\n${info.message}`;
            return info;
        })(),
    ),
    transports,
});

logger.add(
    new winston.transports.Console({
        format: simple(),
    }),
);

export const log = logger.log.bind(logger);
