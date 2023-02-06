import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CallEvents } from '../const/CallEvents';
import { CallSocketsContext } from './CallSocketsContext';

interface IState {
    callId: string;
}

type Props = {
    callId: string;
    children: ReactElement | ReactElement[];
};

interface ContextValue {
    actions: {
        [key: string]: (...args: unknown[]) => unknown;
    };
    state: IState;
    localMediaStream: MediaStream | null;
}

const CallContext = React.createContext<ContextValue>({} as ContextValue);

const CallContextProvider = (props: Props) => {
    const { children, callId } = props;

    const {
        state: { isConnected },
        actions: { emit },
    } = useContext(CallSocketsContext);

    const [state, setState] = useState({ callId });

    const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
    const peers = useRef<Map<string, RTCPeerConnection>>(new Map());

    const start = useCallback(async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: 1280,
                height: 720,
            },
        });

        setLocalMediaStream(localStream);

        emit(CallEvents.JOIN, { callId });
    }, []);

    const handleNewPeer = useCallback(({ peerId, createOffer }: { peerId: string; createOffer: boolean }) => {
        if (peers.current.has(peerId)) {
            return console.log(`Already connected to peer ${peerId}`);
        }
    }, []);

    useEffect(() => {
        if (isConnected) {
            start();
        }
    }, [isConnected, callId]);

    useEffect(
        () => () => {
            localMediaStream?.getTracks().forEach((track) => track.stop());
            emit(CallEvents.LEAVE);
        },
        [localMediaStream],
    );

    console.log({ localMediaStream: localMediaStream });

    const actions = {};

    return <CallContext.Provider value={{ actions, state, localMediaStream }}>{children}</CallContext.Provider>;
};

export { CallContext, CallContextProvider };
