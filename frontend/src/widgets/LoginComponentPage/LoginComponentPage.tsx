import React from 'react';
import { LoginForm } from 'entities/user/UI/LoginForm';
import MainContainer from 'widgets/containers/MainContainer/MainContainer';

const LoginComponentPage = () => {
    return (
        <MainContainer>
            <LoginForm isJoin />
        </MainContainer>
    );
};

export default React.memo(LoginComponentPage);
