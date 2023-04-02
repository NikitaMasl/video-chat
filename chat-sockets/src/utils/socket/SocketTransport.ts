import { Server, Client } from 'socket.io';
import { CallEvents } from '../../const/events/call.events';
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
        if (this.socket.callId) {
            this.io.to(this.socket.callId).emit(`call:${CallEvents.REMOVE_PEER}`, { peerId: this.socket?.user?.id });
        }
        this.socket.disconnect();
    };
}
