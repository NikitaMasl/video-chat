import { Server, Socket } from 'socket.io';
import { log } from '../../config/logger';

export const wrapWithCatch = (func: (socket: Socket, io: Server) => any, io: Server) => async (socket: Socket) => {
    try {
        await func(socket, io);
    } catch (e) {
        console.log({ e });
        // log({ level: 'error', message:e });
        socket.disconnect();
    }
};
