import { Socket } from 'socket.io';

export interface IUser {
    id?: string;
    username?: string;
}

export interface EnhancedSocket extends Socket {
    user?: IUser | null;
}
