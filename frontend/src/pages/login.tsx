import React from 'react';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Locales, Namespaces } from 'shared/const/i18n';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';

const DynamicPageLogin = dynamic(() => import('../widgets/LoginComponentPage/LoginComponentPage'), {
    loading: () => <EntirePageLoader />,
});

const LoginPage = () => <DynamicPageLogin />;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? Locales.EN, [Namespaces.COMMON])),
        },
    };
};

export default LoginPage;
