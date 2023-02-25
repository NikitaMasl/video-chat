import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CallEvents } from '../const/CallEvents';
import AsyncQueue from '../lib/asyncQueue';
import { CallSocketsContext } from './CallSocketsContext';

interface IState {
    callId: string;
    myPeerId?: string;
}

type Props = {
    callId: string;
    children: ReactElement | ReactElement[];
};

interface IMember {
    id: string;
    stream: MediaStream | null;
}

interface ContextValue {
    actions: {
        [key: string]: (...args: unknown[]) => unknown;
    };
    state: IState;
    localMediaStream: MediaStream | null;
    clients: Map<string, IMember>;
}

const CallContext = React.createContext<ContextValue>({} as ContextValue);

const CallContextProvider = (props: Props) => {
    const { children, callId } = props;

    const {
        state: { isConnected },
        actions: { emit, subscribe, unsubscribe },
    } = useContext(CallSocketsContext);

    const [state, setState] = useState({ callId });

    const [clients, setClients] = useState<Map<string, IMember>>(new Map());

    const myPeerId = useRef<string | null>(null);
    const localMediaStream = useRef<MediaStream | null>(null);
    const peers = useRef<Map<string, RTCPeerConnection>>(new Map());

    const addMemberQueueRef = useRef(new AsyncQueue({ maxParallelTasks: 1 }));
    const { current: addMemberQueue } = addMemberQueueRef;

    const start = useCallback(async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: 1280,
                height: 720,
            },
        });

        localMediaStream.current = localStream;

        const res = await emit(CallEvents.JOIN, { callId });

        if (res.peerId) {
            myPeerId.current = res.peerId;
            setState((p) => ({ ...p, myPeerId: res.peerId }));
        }
    }, [callId]);

    const addNewPeer = useCallback(async ({ peerId, createOffer }: { peerId: string; createOffer: boolean }) => {
        if (peers.current.has(peerId) || myPeerId.current === peerId) {
            return console.log(`Already connected to peer ${peerId}`);
        }

        const peerConnectionCreated = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302'],
                },
            ],
        });

        peers.current.set(peerId, peerConnectionCreated);

        const peerConnection = peers.current.get(peerId) as RTCPeerConnection;

        peerConnection.onicecandidateerror = (e) => {
            console.log('onicecandidateerror', e);
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                emit(CallEvents.RELAY_ICE, {
                    peerId,
                    iceCandidate: event.candidate,
                });
            }
        };

        let tracksNumber = 0;

        peerConnection.ontrack = ({ streams: [remoteStream] }) => {
            tracksNumber++;
            if (tracksNumber === 2) {
                // video & audio tracks received
                tracksNumber = 0;

                setClients((p) => {
                    const newState = new Map(p);

                    if (newState.has(peerId)) {
                        (newState.get(peerId) as IMember).stream = remoteStream;
                    } else {
                        newState.set(peerId, { id: peerId, stream: remoteStream });
                    }

                    return newState;
                });
            }
        };

        localMediaStream.current?.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localMediaStream.current as MediaStream);
        });

        if (createOffer) {
            const offer = await peerConnection.createOffer();

            await peerConnection.setLocalDescription(offer);

            emit(CallEvents.RELAY_SDP, {
                peerId,
                sessionDescription: offer,
            });
        }
    }, []);

    const handleNewPeer = useCallback(({ peerId, createOffer }: { peerId: string; createOffer: boolean }) => {
        addMemberQueue.addTask(
            {
                key: peerId,
                task: () => addNewPeer({ peerId, createOffer }),
            },
            false,
        );
    }, []);

    const handleIceCandidate = useCallback(
        async ({ peerId, iceCandidate }: { peerId: string; iceCandidate: RTCIceCandidate }) => {
            const peer = peers.current.get(peerId);

            if (!peer) {
                return;
            }

            peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
        },
        [],
    );

    const handleSessionDescription = useCallback(
        async ({
            peerId,
            sessionDescription: remoteDescription,
        }: {
            peerId: string;
            sessionDescription: RTCSessionDescriptionInit;
        }) => {
            if (myPeerId.current === peerId) {
                return;
            }

            const peer = peers.current.get(peerId);

            if (!peer) {
                return;
            }

            await peer.setRemoteDescription(new RTCSessionDescription(remoteDescription));

            if (remoteDescription.type === 'offer') {
                const answer = await peer.createAnswer();

                await peer.setLocalDescription(answer);

                emit(CallEvents.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                });
            }
        },
        [],
    );

    const handleRemovePeer = useCallback(({ peerId }: { peerId: string }) => {
        const peer = peers.current.get(peerId);

        if (!peer) {
            return;
        }
        peer.close();
        peers.current.delete(peerId);

        setClients((p) => {
            const newState = new Map(p);

            newState.delete(peerId);

            return newState;
        });
    }, []);

    useEffect(() => {
        if (isConnected) {
            start();

            subscribe(CallEvents.ADD_PEER, handleNewPeer);
            subscribe(CallEvents.ICE_CANDIDATE, handleIceCandidate);
            subscribe(CallEvents.SESSION_DESCRIPTION, handleSessionDescription);
            subscribe(CallEvents.REMOVE_PEER, handleRemovePeer);
        }
    }, [isConnected, callId]);

    useEffect(
        () => () => {
            emit(CallEvents.LEAVE);

            localMediaStream.current?.getTracks().forEach((track) => track.stop());

            unsubscribe(CallEvents.ADD_PEER, handleNewPeer);
            unsubscribe(CallEvents.ICE_CANDIDATE, handleIceCandidate);
            unsubscribe(CallEvents.SESSION_DESCRIPTION, handleSessionDescription);
            unsubscribe(CallEvents.REMOVE_PEER, handleRemovePeer);
        },
        [],
    );

    const actions = {};

    return (
        <CallContext.Provider
            value={{
                actions,
                state,
                clients,
                localMediaStream: localMediaStream.current,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};

export { CallContext, CallContextProvider };
