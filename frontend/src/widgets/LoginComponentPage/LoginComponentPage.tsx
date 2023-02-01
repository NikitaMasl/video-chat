import React from 'react';
import { LoginForm } from 'entities/user/LoginForm';
import MainContainer from 'widgets/containers/MainContainer/MainContainer';

const LoginComponentPage = () => {
    return (
        <MainContainer>
            <LoginForm />
        </MainContainer>
    );
};

export default React.memo(LoginComponentPage);
