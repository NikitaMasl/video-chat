import React, { ReactElement, useCallback, useContext, useReducer, useState } from 'react';
import { CALL_ITEM_JOIN_PAGE } from 'shared/const/url/CLIENT_PATHS';
import { copyText } from 'shared/lib/utils/copyText';
import { CallEvents } from '../const/CallEvents';
import { TrackType } from '../const/TrackType';
import { CallContext } from './CallContext';
import { CallSocketsContext } from './CallSocketsContext';

interface IState {
    isCamMuted: boolean;
    isMicMuted: boolean;
}

const DEFAULT_STATE = {
    isCamMuted: false,
    isMicMuted: false,
};

interface ContextValue {
    state: IState;
    actions: {
        copyLinkHandler: () => void;
        muteUnmuteCamera: () => void;
        muteUnmuteMic: () => void;
    };
}

type Props = {
    children: ReactElement | ReactElement[];
    callId: string;
};

const getDeviceFieldName = (permission: TrackType) => (permission === TrackType.VIDEO ? 'isCamMuted' : 'isMicMuted');

const CallActionsContext = React.createContext<ContextValue>({} as ContextValue);

const CallActionsContextProvider = (props: Props) => {
    const { children, callId } = props;

    const {
        state: { localMediaStream },
        actions: { startVideoTracks, startAudioTracks },
        peers,
    } = useContext(CallContext);

    const {
        actions: { emit },
    } = useContext(CallSocketsContext);

    const [isPemissionToggleProcessing, setIsPemissionToggleProcessing] = useState<boolean>(false);
    const [state, setState] = useReducer((state: IState, action: Partial<IState>) => {
        return {
            ...state,
            ...action,
        };
    }, DEFAULT_STATE);

    const copyLinkHandler = useCallback(() => {
        copyText(`${window.location.origin}${CALL_ITEM_JOIN_PAGE({ callId })}`);
    }, [callId]);

    const stopVideoStream = useCallback(() => {
        if (localMediaStream) {
            localMediaStream.getVideoTracks().forEach((track) => {
                track.stop();
            });
        }

        setState({ [getDeviceFieldName(TrackType.VIDEO)]: true });
    }, [localMediaStream]);

    const startVideoStream = useCallback(async () => {
        const [track] = await startVideoTracks();

        if (track) {
            await Promise.all(
                [...peers.values()].map(async (pc) => {
                    const sender = pc.getSenders().find((s) => s?.track?.kind === (track as MediaStreamTrack).kind);

                    await sender?.replaceTrack(track);
                }),
            );
        }

        setState({ isCamMuted: false });
    }, [peers, startVideoTracks]);

    const stopAudioStream = useCallback(() => {
        if (localMediaStream) {
            localMediaStream.getAudioTracks().forEach((track) => {
                track.stop();
            });
        }

        emit(CallEvents.MUTE_UNMUTE, { isMicMuted: true });
        setState({ [getDeviceFieldName(TrackType.AUDIO)]: true });
    }, [localMediaStream, emit]);

    const startAudioStream = useCallback(async () => {
        const [track] = await startAudioTracks();

        if (track) {
            await Promise.all(
                [...peers.values()].map(async (pc) => {
                    const sender = pc.getSenders().find((s) => s?.track?.kind === (track as MediaStreamTrack).kind);

                    await sender?.replaceTrack(track);
                }),
            );
        }

        emit(CallEvents.MUTE_UNMUTE, { isMicMuted: false });
        setState({ isMicMuted: false });
    }, [peers, startAudioTracks, emit]);

    const muteUnmuteCamera = useCallback(async () => {
        if (isPemissionToggleProcessing) {
            return;
        }

        setIsPemissionToggleProcessing(true);

        if (!state.isCamMuted) {
            stopVideoStream();
        } else {
            await startVideoStream();
        }
        setIsPemissionToggleProcessing(false);
    }, [isPemissionToggleProcessing, state.isCamMuted, stopVideoStream, startVideoStream]);

    const muteUnmuteMic = useCallback(async () => {
        if (isPemissionToggleProcessing) {
            return;
        }

        setIsPemissionToggleProcessing(true);

        if (!state.isMicMuted) {
            stopAudioStream();
        } else {
            await startAudioStream();
        }
        setIsPemissionToggleProcessing(false);
    }, [isPemissionToggleProcessing, state.isMicMuted, startAudioStream, stopAudioStream]);

    const actions = {
        copyLinkHandler,
        muteUnmuteCamera,
        muteUnmuteMic,
    };

    return <CallActionsContext.Provider value={{ actions, state }}>{children}</CallActionsContext.Provider>;
};

export { CallActionsContext, CallActionsContextProvider };
