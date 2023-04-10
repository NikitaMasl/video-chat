import { onConnection } from './onConnection';
import { Server } from 'socket.io';
import { EnhancedSocket } from '../types';
import { sendHttpRequest } from '../utils/http/sendHttpRequest';
import { AUTH_USER } from '../const/http/API_URL';
import { wrapWithCatch } from '../utils/wrappers/wrapWithCatch';
import { RedisClient } from 'shared/clients/redis';

export const initMessages = (io: Server, redis: RedisClient) => {
    io.use(async (socket: EnhancedSocket, next) => {
        const { cookie } = socket.handshake.headers;

        if (cookie) {
            try {
                let response;

                try {
                    response = await sendHttpRequest({
                        url: AUTH_USER,
                        method: 'get',
                        headers: { cookie },
                    });
                } catch (e) {}

                if (!response) {
                    throw new Error('Authentication error');
                }

                if (response && response.body.success) {
                    socket.user = response.body.success.user;
                }

                next();
            } catch (e) {
                console.log(e);
                socket.emit('connect_error', { errorMessage: 'Authentication error' });
            }
        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', wrapWithCatch(onConnection, io, redis));
};
