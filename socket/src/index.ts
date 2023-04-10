import socket from 'socket.io';
import process from 'process';
import { log } from './config/logger';
import { initMessages as initSocketMessages } from './socket/initMessages';
import vars from './config/vars';
import config from './config/socket';
// import { initConsumers } from './broker/consumer';

export async function run(): Promise<void> {
    const { port, env } = vars;
    const io = socket(config.server);

    io.listen(port as number);

    await initRabbitMQ(log);

    initSocketMessages(io);

    log({ level: 'warn', message: `Socket server started on port ${port} [${env}]` });
}

run().catch((e) => {
    log({ level: 'error', message: e.message });
    closeRabbitMQ();
    process.exit();
});
