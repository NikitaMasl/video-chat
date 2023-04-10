import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Locales, Namespaces } from 'shared/const/i18n';
import TextChat from 'widgets/TextChat';

const TestChat = () => {
    return <TextChat callId={'dassad'}/>;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? Locales.EN, [Namespaces.COMMON])),
        },
    };
};

export default TestChat;
