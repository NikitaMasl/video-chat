import socket from 'socket.io';
import process from 'process';
import { log } from './config/logger';
import { initMessages as initSocketMessages } from './socket/initMessages';
import { RedisClient } from 'shared/clients/redis';
import vars from './config/vars';
import config from './config/socket';
// import { initConsumers } from './broker/consumer';

const { redis: redisConf } = vars;

export async function run(): Promise<void> {
    const { port, env } = vars;
    const io = socket(config.server);

    io.listen(port as number);
    // await initConsumers(io);

    const redis = new RedisClient(log);

    redis.connect({
        port: redisConf.port,
        host: redisConf.host,
        password: redisConf.password,
    });

    redis.consumeStreamInRange({
        streamKey: 'test',
    });

    initSocketMessages(io);

    log({ level: 'warn', message: `Socket server started on port ${port} [${env}]` });
}

run().catch((e) => {
    log({ level: 'error', message: e.message });
    process.exit();
});
