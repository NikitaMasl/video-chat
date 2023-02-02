import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import vars from './common/vars';
import { log } from './common/logger';
import routes from './routes';
import error from './middlewares/errorHandler';
import { withSanitizer } from './middlewares/withSanitizer';
import mongoose from './common/mongoose';
// import mongoose from './common/mongoose';

const { isLocal, clientUrl, env, port } = vars;

export async function run(): Promise<void> {
    await mongoose.connect();

    const app = express();

    app.use(withSanitizer());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
        cors({
            origin: isLocal ? clientUrl : undefined,
            credentials: true,
        }),
    );

    app.use('/api', routes);

    const server = http.createServer(app);

    app.use(error.handler);

    server.listen(port, () => log({ level: 'warn', message: `Backend started on port ${port} [${env}]` }));
}

run().catch((e) => {
    log({ level: 'error', message: e.message });
    process.exit();
});
