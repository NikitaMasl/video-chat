import { Server, Socket } from 'socket.io';
import SocketTransport from '../utils/socket/SocketTransport';
import { routes } from '../routes';

export const onConnection = async (socket: Socket, io: Server) => {
    new SocketTransport(io, socket, routes);
};
