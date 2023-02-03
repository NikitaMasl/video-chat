import { useGetCallQuery } from 'app/store/api/apiService';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IError } from 'shared/api/const/type';
import { NOT_FOUND } from 'shared/const/url/CLIENT_PATHS';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';
import MainContainer from 'widgets/containers/MainContainer/MainContainer';

type Props = {
    callId: string;
};

const CallComponentPage = (props: Props) => {
    const { callId } = props;

    const router = useRouter();

    console.log({ callId });

    const { data: getCallData, error: getCallError } = useGetCallQuery({ id: callId });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (getCallError) {
            router.push(NOT_FOUND);
        }
    }, [getCallError]);

    if (isLoading) {
        return <EntirePageLoader />;
    }

    return (
        <MainContainer>
            <>LoginForm</>
        </MainContainer>
    );
};

export default React.memo(CallComponentPage);
