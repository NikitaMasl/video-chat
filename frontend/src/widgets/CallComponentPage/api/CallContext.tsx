import React, { ReactElement, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { CallEvents } from '../const/CallEvents';
import AsyncQueue from '../../../shared/lib/asyncQueue';
import { CallSocketsContext } from './CallSocketsContext';

interface IState {
    callId: string;
    myPeerId?: string;
    localMediaStream: MediaStream | null;
}

type Props = {
    callId: string;
    children: ReactElement | ReactElement[];
};

interface IMember {
    id: string;
    stream: MediaStream | null;
    isMicMuted?: boolean;
}

interface ContextValue {
    actions: {
        startLocalStream: ({ audio, video }: { audio?: boolean; video?: boolean }) => Promise<MediaStream>;
        startVideoTracks: () => Promise<MediaStreamTrack[]>;
        startAudioTracks: () => Promise<MediaStreamTrack[]>;
        getOwnPeer: () => RTCPeerConnection | undefined;
    };
    state: IState;
    peers: Map<string, RTCPeerConnection>;
    clients: Map<string, IMember>;
    localMediaStream: MediaStream | null;
}

const CallContext = React.createContext<ContextValue>({} as ContextValue);

const CallContextProvider = (props: Props) => {
    const { children, callId } = props;

    const {
        state: { isConnected },
        actions: { emit, subscribe, unsubscribe },
    } = useContext(CallSocketsContext);

    const [state, setState] = useReducer(
        (state: IState, action: Partial<IState>) => {
            return {
                ...state,
                ...action,
            };
        },
        { callId, localMediaStream: null },
    );

    const [clients, setClients] = useState<Map<string, IMember>>(new Map());

    const myPeerId = useRef<string | null>(null);
    const localMediaStream = useRef<MediaStream | null>(null);
    const peers = useRef<Map<string, RTCPeerConnection>>(new Map());

    const addMemberQueueRef = useRef(new AsyncQueue({ maxParallelTasks: 1 }));
    const { current: addMemberQueue } = addMemberQueueRef;

    const startVideoTracks = useCallback(async () => {
        localMediaStream.current?.getVideoTracks().forEach((t) => {
            t.stop();
            localMediaStream.current?.removeTrack(t);
        });

        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { width: 1280, height: 720 },
        });

        const videoTracks = localStream.getVideoTracks();

        videoTracks.forEach((t) => {
            localMediaStream.current?.addTrack(t);
        });

        setState({ localMediaStream: localMediaStream.current });

        return videoTracks;
    }, []);

    const startAudioTracks = useCallback(async () => {
        localMediaStream.current?.getAudioTracks().forEach((t) => {
            t.stop();
            localMediaStream.current?.removeTrack(t);
        });

        const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });

        const audioTracks = localStream.getAudioTracks();

        audioTracks.forEach((t) => {
            localMediaStream.current?.addTrack(t);
        });

        setState({ localMediaStream: localMediaStream.current });

        return audioTracks;
    }, []);

    const startLocalStream = useCallback(
        async ({ audio = true, video = true }: { audio?: boolean; video?: boolean }) => {
            localMediaStream.current?.getTracks().forEach((t) => {
                t.stop();
            });

            const localStream = await navigator.mediaDevices.getUserMedia({
                audio,
                video: video && { width: 1280, height: 720 },
            });

            localMediaStream.current = localStream;
            setState({ localMediaStream: localStream });

            return localStream;
        },
        [],
    );

    const start = useCallback(async () => {
        await startLocalStream({});

        const res = await emit(CallEvents.JOIN, { callId });

        if (res.peerId) {
            myPeerId.current = res.peerId;
            setState({ myPeerId: res.peerId });
        }
    }, [callId, startLocalStream, emit]);

    const addNewPeer = useCallback(
        async ({ peerId, createOffer }: { peerId: string; createOffer: boolean }) => {
            if (peers.current.has(peerId)) {
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

            peerConnection.ontrack = (event) => {
                const {
                    streams: [remoteStream],
                } = event;

                setClients((p) => {
                    const newState = new Map(p);
                    newState.set(peerId, { id: peerId, stream: null });
                    return newState;
                });

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
        },
        [emit],
    );

    const handleNewPeer = useCallback(
        ({ peerId, createOffer }: { peerId: string; createOffer: boolean }) => {
            addMemberQueue.addTask(
                {
                    key: peerId,
                    task: () => addNewPeer({ peerId, createOffer }),
                },
                false,
            );
        },
        [addMemberQueue, addNewPeer],
    );

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
        [emit],
    );

    const handleMuteUnmute = useCallback(({ peerId, isMicMuted }: { peerId: string; isMicMuted: boolean }) => {
        setClients((p) => {
            const newState = new Map(p);

            const peer = p.get(peerId);

            if (peer) {
                newState.set(peerId, {
                    ...peer,
                    isMicMuted,
                });
            }

            return newState;
        });
    }, []);

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

    const getOwnPeer = useCallback(() => {
        if (myPeerId.current) return peers.current.get(myPeerId.current);
    }, []);

    useEffect(() => {
        if (isConnected) {
            start();

            subscribe(CallEvents.ADD_PEER, handleNewPeer);
            subscribe(CallEvents.ICE_CANDIDATE, handleIceCandidate);
            subscribe(CallEvents.SESSION_DESCRIPTION, handleSessionDescription);
            subscribe(CallEvents.REMOVE_PEER, handleRemovePeer);
            subscribe(CallEvents.MUTE_UNMUTE, handleMuteUnmute);
        }
    }, [
        isConnected,
        callId,
        handleIceCandidate,
        handleNewPeer,
        handleRemovePeer,
        handleSessionDescription,
        start,
        subscribe,
    ]);

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

    const actions = {
        getOwnPeer,
        startLocalStream,
        startVideoTracks,
        startAudioTracks,
    };

    return (
        <CallContext.Provider
            value={{
                actions,
                state,
                clients,
                peers: peers.current,
                localMediaStream: localMediaStream.current,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};

export { CallContext, CallContextProvider };
