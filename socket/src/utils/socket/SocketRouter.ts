import _ from 'lodash';
import { log } from '../../config/logger';
import { emptyFunction } from '../helpers/emptyFunction';
import SocketTransport from './SocketTransport';

export default class SocketRouter {
    basePath: string;
    routes: any;
    streamRoutes: any;

    constructor(basePath: string) {
        this.basePath = basePath;
        this.routes = [];
        this.streamRoutes = [];
    }

    addRoute(path: string, ...handlers: any[]) {
        this.routes.push([path, handlers]);
    }

    addStreamRoute(path: string, options: Object[], ...handlers: any[]) {
        this.streamRoutes.push([path, ...options, handlers]);
    }

    addSocket(socketTransport: SocketTransport) {
        this.routes.map(([route, handlers]: any) => {
            const event = `${this.basePath}${route}`;
            socketTransport.addRoute(event, (data: unknown, cb: any) => {
                if (!_.get('options', 'withoutLog', false)) {
                    log({
                        level: 'info',
                        message: `Receive '${event}' from userId: '${socketTransport.getUserId()}'`,
                        data,
                    });
                }

                this.runHandlers({
                    handlers,
                    socketTransport,
                    data,
                    cb: cb || emptyFunction,
                });
            });
        });
    }

    // eslint-disable-next-line class-methods-use-this
    async runHandlers({ handlers, socketTransport, data, cb }: any) {
        try {
            // eslint-disable-next-line no-restricted-syntax
            for (const h of handlers) {
                // eslint-disable-next-line no-await-in-loop
                await h(socketTransport, data, cb);
            }
        } catch (e) {
            console.log({ e });
            socketTransport.onDisconnect();
        }
    }
}
