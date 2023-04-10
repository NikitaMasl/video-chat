import { Server, Socket } from 'socket.io';
import { log } from '../../config/logger';
import { RedisClient } from 'shared/clients/redis';

export const wrapWithCatch =
    (func: (socket: Socket, io: Server, redis: RedisClient) => any, io: Server, redis: RedisClient) =>
    async (socket: Socket) => {
        try {
            await func(socket, io, redis);
        } catch (e) {
            console.log({ e });
            // log({ level: 'error', message:e });
            socket.disconnect();
        }
    };
