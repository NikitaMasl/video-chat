import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LOGIN_PAGE } from 'shared/const/url/CLIENT_PATHS';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';

const RootPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(LOGIN_PAGE);
    }, []);

    return <EntirePageLoader />;
};

RootPage.getInitialProps = async () => ({
    namespacesRequired: ['common'],
});

export default RootPage;
