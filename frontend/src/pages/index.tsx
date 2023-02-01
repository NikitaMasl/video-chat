import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LOGIN_PAGE } from 'shared/const/url/CLIENT_PATHS';

const RootPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push(LOGIN_PAGE);
    }, []);

    return <>Loading...</>;
};

RootPage.getInitialProps = async () => ({
    namespacesRequired: ['common'],
});

export default RootPage;
