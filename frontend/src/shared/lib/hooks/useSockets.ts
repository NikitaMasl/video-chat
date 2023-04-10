import { useState, useRef, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

export interface EventToSend {
    event: string;
    data: unknown;
}

export interface DefaultEventsMap {
    [event: string]: (...args: any[]) => void;
}

interface IState {
    isConnected: boolean;
    socket: typeof Socket | null;
}
export interface EventListeners {
    [key: string]: ((...args: unknown[]) => void)[];
}

type Options = {
    url: string;
    path: string;
}

type Result = {
    isConnected: boolean;
    socket: typeof Socket | null;

    subscribe: (event: string, ...args: unknown[]) => void;
    unsubscribe: (event: string, ...args: unknown[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit: (event: string, ...args: unknown[]) => Promise<any>;
    disconnect: () => void;
    connect: () => void;
}

const useSockets = (options: Options): Result => {
    const { url, path } = options;

    const socketRef = useRef<SocketIOClient.Socket | null>(null);
    const connectingRef = useRef(false);
    const eventListenersRef = useRef<EventListeners>({});
    const eventsToSendRef = useRef<EventToSend[]>();

    const [isConnected, setConnected] = useState(false);
    const [connectError, setConnectError] = useState(null);

    const emit = useCallback(
        (event: string, data: unknown) =>
            new Promise((resolve, reject) => {
                if (socketRef && socketRef.current) {
                    socketRef.current.emit(event, data, (answer: unknown, err: unknown) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(answer);
                        }
                    });
                }
            }),
        [],
    );

    const subscribe = useCallback((event: string, handler: any) => {
        if (socketRef.current) {
            socketRef.current.on(event as string, handler);
        }

        eventListenersRef.current[event] = eventListenersRef.current[event] || [];
        eventListenersRef.current[event].push(handler);
    }, []);

    const unsubscribe = useCallback((event: keyof EventListeners, handler: any) => {
        if (socketRef.current) {
            socketRef.current.removeListener(event as string, handler);
        }

        if (eventListenersRef.current[event]?.length) {
            eventListenersRef.current[event] = eventListenersRef.current[event].filter((el) => el !== handler);
            if (!eventListenersRef.current[event]?.length) {
                delete eventListenersRef.current[event];
            }
        }
    }, []);

    const connect = useCallback(() => {
        if (connectingRef.current || socketRef.current) {
            return;
        }
        connectingRef.current = true;

        const socket = io(url, {
            transports: ['websocket'],
            path: path,
        });

        socket.on('error', (error: any) => {
            console.log('Error; SocketContext', { error });
        });
        const events = Object.keys(eventListenersRef.current);

        events.map((event) => {
            eventListenersRef.current[event].map((handler) => {
                socket.on(event, handler);
            });
        });

        socket.on('connect', () => {
            socketRef.current = socket;
            connectingRef.current = false;

            setConnected(true);
            if (eventsToSendRef.current) {
                eventsToSendRef.current.forEach(({ event, data }) => emit(event, data));
                eventsToSendRef.current = [];
            }
        });

        socket.on('connect_error', (err: any) => {
            // eslint-disable-next-line no-console
            console.log('CallSocketContext.connect_error', err);
            setConnectError(err);
        });

        socket.on('disconnect', (reason: string) => {
            console.log('SocketContext.disconnect', { disconnectionReason: reason });
            setConnected(false);
            eventsToSendRef.current = [];
            eventListenersRef.current = {};
            connectingRef.current = false;
            socketRef.current = null;
        });
    }, []);

    const disconnect = useCallback((clearCache = true) => {
        if (!socketRef.current) {
            return;
        }
        socketRef.current.disconnect();
        setConnected(false);
        if (clearCache) {
            eventsToSendRef.current = [];
            eventListenersRef.current = {};
            connectingRef.current = false;
            socketRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (connectError) {
            console.log('Socket connection error', { error: connectError });
        }
    }, [connectError])

    useEffect(() => () => disconnect(), []);

    return {
        isConnected,
        socket: socketRef.current,

        subscribe,
        unsubscribe,
        emit,
        disconnect,
        connect,
    }
}

export default useSockets
