import React from 'react';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';
import { Locales, Namespaces } from 'shared/const/i18n';

const DynamicPageJoin = dynamic(() => import('../../../widgets/JoinComponentPage/JoinComponentPage'), {
    loading: () => <EntirePageLoader />,
});

const JoinPage = () => <DynamicPageJoin />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? Locales.EN, [Namespaces.COMMON])),
        },
    };
};

export default JoinPage;
