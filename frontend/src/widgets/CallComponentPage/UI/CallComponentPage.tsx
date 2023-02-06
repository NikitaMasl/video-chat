import { useGetCallQuery } from 'app/store/api/apiService';
import { Video } from 'entities/call/UI/Video';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { IError } from 'shared/api/const/type';
import { NOT_FOUND } from 'shared/const/url/CLIENT_PATHS';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';
import MainContainer from 'widgets/containers/MainContainer/MainContainer';
import { CallContext, CallContextProvider } from '../api/CallContext';
import { CallSocketsContext, CallSocketsContextProvider } from '../api/CallSocketsContext';

type Props = {
    callId: string;
};

const CallComponentPage = (props: Props) => {
    const { callId } = props;

    const {
        actions: { connect },
        state: { isConnected },
    } = useContext(CallSocketsContext);

    const { localMediaStream } = useContext(CallContext);

    const router = useRouter();

    const { data: getCallData, error: getCallError } = useGetCallQuery({ id: callId });

    const [isLoading, setIsLoading] = useState(true);
    const [call, setCall] = useState();

    useEffect(() => {
        if (getCallError) {
            router.push(NOT_FOUND);
        }
    }, [getCallError]);

    useEffect(() => {
        if (getCallData) {
            // setCall(getCallData.)

            if (!isConnected) {
                connect();
            }
        }
    }, [getCallData, isConnected]);

    if (!isConnected) {
        return <EntirePageLoader />;
    }
    console.log({ localMediaStream });
    return (
        <MainContainer>
            <Video stream={localMediaStream} />
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
