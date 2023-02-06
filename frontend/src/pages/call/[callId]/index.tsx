import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { EntirePageLoader } from 'shared/UI/EntirePageLoader';

const DynamicPageLogin = dynamic(() => import('../../../widgets/CallComponentPage/UI/CallComponentPage'), {
    loading: () => <EntirePageLoader />,
});

const CallItemPage = () => {
    const router = useRouter();

    return <DynamicPageLogin callId={router.query.callId as string} />;
};

CallItemPage.getInitialProps = async () => ({
    namespacesRequired: ['common'],
});

export default CallItemPage;
