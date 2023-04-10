import React, { ReactElement, useCallback, useCallback, useEffect, useRef, useState } from 'react';
import { publicConfig } from 'app/publicConfig';
import io, { Socket } from 'socket.io-client';
import useSockets from 'shared/lib/hooks/useSockets';
import { ChatEvents } from '../const/ChatEvents';

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
    callId: string;
    children: ReactElement | ReactElement[];
};

interface ContextValue {
    actions: {
        sendMessageHandler: ({ text }: { text: string }) => void;
    };
    state: IState;
}

const ChatSocketsContext = React.createContext<ContextValue>({} as ContextValue);

const ChatSocketsContextProvider = (props: Props) => {
    const { children, callId } = props;

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
        path: '/socket.io/chat',
    });

    const startMessaging = useCallback(async () => {
        await emit(ChatEvents.JOIN, { callId });
    }, [callId]);

    const sendMessageHandler = useCallback(({ text }: { text: string }) => {
        emit(ChatEvents.SEND_MESSAGE, { text });
    }, []);

    useEffect(() => {
        if (isConnected && callId) {
            startMessaging();
        }
    }, [isConnected, callId]);

    useEffect(() => {
        if (!isConnected) {
            connect();
        }
    }, [isConnected, connect]);

    return (
        <ChatSocketsContext.Provider
            value={{
                actions: {
                    sendMessageHandler,
                },
                state: { isConnected, socket },
            }}
        >
            {children}
        </ChatSocketsContext.Provider>
    );
};

export { ChatSocketsContext, ChatSocketsContextProvider };
