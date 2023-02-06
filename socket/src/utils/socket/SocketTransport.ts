import { Server, Client } from 'socket.io';
import { EnhancedSocket } from '../../types';
import SocketRouter from './SocketRouter';

const KEYS = {
    userId: 'id',
};

export default class SocketTransport {
    io: Server;
    socket: EnhancedSocket;
    id: string;

    constructor(io: Server, socket: EnhancedSocket, routes: SocketRouter[]) {
        this.io = io;

        this.socket = socket;

        this.id = socket.id;

        this.init(routes);
    }

    sendToAll(event: string, data?: unknown) {
        this.io.emit(event, data);
    }

    sendToRoom(room: string, event: string, data?: unknown) {
        this.io.to(room).emit(event, data);
    }

    getInfo(key: keyof Client) {
        return this.socket.client[key];
    }

    // eslint-disable-next-line class-methods-use-this
    sendToSocket(socket: EnhancedSocket, event: string, data?: unknown) {
        if (socket) {
            socket.emit(event, data);
        }
    }

    async init(routes: SocketRouter[]) {
        this.socket.join(`user_${this.socket.user?.id}`);

        routes.map((route) => route.addSocket(this));

        this.addRoute('disconnect', this.onDisconnect);
    }

    addRoute(event: string, handler: any) {
        this.socket.on(event, handler);
    }

    getUserId() {
        return this.getInfo(KEYS.userId as keyof Client);
    }

    onDisconnect = () => {
        this.socket.disconnect();
    };
}
