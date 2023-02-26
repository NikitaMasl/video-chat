import React from 'react';
import { LoginForm } from 'entities/user/UI/LoginForm';
import MainContainer from 'widgets/containers/MainContainer/MainContainer';

const JoinComponentPage = () => {
    return (
        <MainContainer>
            <LoginForm isJoin />
        </MainContainer>
    );
};

export default React.memo(JoinComponentPage);
