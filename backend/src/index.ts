import express from 'express';
import cors from 'cors';
import http from 'http';
import vars from './common/vars';
import { log } from './common/logger';
import routes from './routes';
import error from './middlewares/errorHandler';
// import mongoose from './common/mongoose';

const { isLocal, clientUrl, env, port } = vars;

export async function run(): Promise<void> {
    // const connection = await mongoose.connect();

    const app = express();

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
