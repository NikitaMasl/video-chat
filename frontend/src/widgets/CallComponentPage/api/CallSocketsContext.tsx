import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { publicConfig } from 'app/publicConfig';
import io, { Socket } from 'socket.io-client';
import useSockets from 'shared/lib/hooks/useSockets';

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

type Props = {
    children: ReactElement | ReactElement[];
};


interface ContextValue {
    actions: {
        subscribe: (event: string, ...args: unknown[]) => void;
        unsubscribe: (event: string, ...args: unknown[]) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        emit: (event: string, ...args: unknown[]) => Promise<any>;
        disconnect: () => void;
        connect: () => void;
    };
    state: IState;
}

const CallSocketsContext = React.createContext<ContextValue>({} as ContextValue);

const CallSocketsContextProvider = (props: Props) => {
    const { children } = props;

    const {
        isConnected,
        socket,

        subscribe,
        unsubscribe,
        emit,
        disconnect,
        connect,
    } = useSockets({
        url: publicConfig.socketUrl,
        path: '/socket.io/call',
    })

    return (
        <CallSocketsContext.Provider value={{ actions: {
            subscribe,
            unsubscribe,
            emit,
            disconnect,
            connect,
        }, state: { isConnected, socket } }}>
            {children}
        </CallSocketsContext.Provider>
    );
};

export { CallSocketsContext, CallSocketsContextProvider };
