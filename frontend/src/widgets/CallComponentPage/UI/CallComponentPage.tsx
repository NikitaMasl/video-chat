import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useGetCallQuery } from 'app/store/api/apiService';
import { Video } from 'entities/call/UI/Video';
import Draggable from 'react-draggable';
import { useRouter } from 'next/router';
import { cnb } from 'cnbuilder';
import { NOT_FOUND } from 'shared/const/url/CLIENT_PATHS';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';
import { Grid } from 'shared/UI/Grid';
import MainContainer from 'widgets/containers/MainContainer/MainContainer';
import { CallContext, CallContextProvider } from '../api/CallContext';
import { CallSocketsContext, CallSocketsContextProvider } from '../api/CallSocketsContext';

import styles from './CallComponentPage.module.scss';

type Props = {
    callId: string;
};

const CallComponentPage = (props: Props) => {
    const { callId } = props;

    const { data: getCallData, error: getCallError } = useGetCallQuery({ id: callId });

    const {
        actions: { connect },
        state: { isConnected },
    } = useContext(CallSocketsContext);

    const {
        state: { myPeerId },
        localMediaStream,
        clients,
    } = useContext(CallContext);

    const router = useRouter();

    const [mainVideoId, setMainVideoId] = useState<string>('');

    const clientsArr = useMemo(() => [...clients.values()].filter((c) => c.id !== mainVideoId), [clients, mainVideoId]);

    const mainVideoStream = useMemo(() => {
        if (mainVideoId) {
            return clients.get(mainVideoId)?.stream;
        }
    }, [clients, mainVideoId]);

    const setMainVideoHandler = useCallback((id: string) => {
        setMainVideoId(id);
    }, []);

    useEffect(() => {
        if (getCallError) {
            router.push(NOT_FOUND);
        }
    }, [getCallError]);

    useEffect(() => {
        if (getCallData && !isConnected) {
            connect();
        }
    }, [getCallData, isConnected]);

    useEffect(() => {
        if (!mainVideoId && clientsArr.length) {
            setMainVideoHandler(clientsArr[0].id);
        }
    }, [mainVideoId, clientsArr]);

    if (!isConnected) {
        return <EntirePageLoader />;
    }

    return (
        <MainContainer>
            <>
                <Draggable>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        className={styles.secondaryVideosContainer}
                    >
                        <div className={styles.secondaryVideoWrapper}>
                            <Video className={styles.secondaryVideo} stream={localMediaStream} muted />
                        </div>
                        {clientsArr.map((client) => (
                            <div
                                key={client.id}
                                className={cnb(styles.secondaryVideoWrapper, styles.clicable)}
                                onClick={() => setMainVideoHandler(client.id)}
                            >
                                <Video className={styles.secondaryVideo} stream={client.stream} />
                            </div>
                        ))}
                    </Grid>
                </Draggable>
                {mainVideoStream && (
                    <div className={styles.mainVideoContainer}>
                        <div className={styles.mainVideoWrapper}>
                            <Video className={styles.mainVideo} stream={mainVideoStream} />
                        </div>
                    </div>
                )}
            </>
        </MainContainer>
    );
};

const PrefetchWrapper = (props: Props) => {
    const { callId } = props;

    return (
        <CallSocketsContextProvider>
            <CallContextProvider callId={callId}>
                <CallComponentPage callId={callId} />
            </CallContextProvider>
        </CallSocketsContextProvider>
    );
};

export default React.memo(PrefetchWrapper);
