import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';
import { Locales, Namespaces } from 'shared/const/i18n';

const DynamicPageLogin = dynamic(() => import('../../../widgets/CallComponentPage/UI/CallComponentPage'), {
    loading: () => <EntirePageLoader />,
});

const CallItemPage = () => {
    const router = useRouter();

    return <DynamicPageLogin callId={router.query.callId as string} />;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? Locales.EN, [Namespaces.COMMON])),
        },
    };
};

export default CallItemPage;
