import express from 'express';
import cors from 'cors';
import http from 'http';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { RedisClient } from 'shared/clients/redis';
import vars from './common/vars';
import { log } from './common/logger';
import routes from './routes';
import error from './middlewares/errorHandler';
import { withSanitizer } from './middlewares/withSanitizer';
import mongoose from './common/mongoose';
import { initJwtStrategy } from './common/auth';
import { closeRabbitMQ, initRabbitMQ } from './rabbit';

const { isLocal, clientUrl, env, port, redis: redisConf } = vars;

export async function run(): Promise<void> {
    await mongoose.connect();

    const app = express();

    app.use(cookieParser(vars.auth.cookieSecret));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(expressSession({ secret: vars.auth.cookieSecret, resave: true, saveUninitialized: true }));

    app.use(withSanitizer());

    app.use(passport.initialize());
    app.use(passport.session());

    initJwtStrategy();

    app.use(
        cors({
            origin: isLocal ? clientUrl : undefined,
            credentials: true,
        }),
    );

    const redis = new RedisClient(log);

    redis.connect({
        port: redisConf.port,
        host: redisConf.host,
        password: redisConf.password,
    });

    await initRabbitMQ(log, redis);

    app.use('/api', routes);

    const server = http.createServer(app);

    app.use(error.handler);

    server.listen(port, () => log({ level: 'warn', message: `Backend started on port ${port} [${env}]` }));
}

run().catch((e) => {
    log({ level: 'error', message: e.message });
    closeRabbitMQ();
    process.exit();
});
