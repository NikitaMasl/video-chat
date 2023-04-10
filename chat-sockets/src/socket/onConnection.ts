import { Server, Socket } from 'socket.io';
import SocketTransport from '../utils/socket/SocketTransport';
import { routes } from '../routes';
import { RedisClient } from 'shared/clients/redis';

export const onConnection = async (socket: Socket, io: Server, redis: RedisClient) => {
    new SocketTransport(io, socket, redis, routes);
};
