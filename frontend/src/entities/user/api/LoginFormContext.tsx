import React, { useEffect, useState, useRef } from 'react';
import { useRegisterUserMutation } from 'app/store/api/apiService';
import { IError } from 'shared/api/const/type';

type Props = {
    children: React.ReactNode;
};

type State = {
    errorMessage: string | null;
};

interface ContextValue {
    state: State;
    actions: {
        [key: string]: (...args: unknown[]) => unknown;
    };
}

const DEFAULT_STATE = {
    errorMessage: null,
};

const HIDE_ERROR_TIMEOUT_IN_MS = 3000;

const LoginFormContext = React.createContext<ContextValue>({} as ContextValue);
const LoginFormContextProvider = (props: Props) => {
    const { children } = props;

    const [state, setState] = useState<State>(DEFAULT_STATE);

    const errorHideTimerRer = useRef(0);

    const [
        registerUserRequest,
        { data: registerUserDataSuccess, error: registerUserDataError, reset: registerUserDataReset },
    ] = useRegisterUserMutation({});

    useEffect(() => {
        if (registerUserDataSuccess) {
            console.log({ registerUserDataSuccess });
        }
    }, [registerUserDataSuccess]);

    useEffect(() => {
        if (registerUserDataError) {
            const error = registerUserDataError as unknown as IError;

            setState((p) => ({ ...p, errorMessage: error.data.errors[0].message }));

            errorHideTimerRer.current = window.setTimeout(() => {
                registerUserDataReset();
                setState((p) => ({ ...p, errorMessage: null }));
            }, HIDE_ERROR_TIMEOUT_IN_MS);
        }
    }, [registerUserDataError]);

    useEffect(
        () => () => {
            registerUserDataReset();

            clearTimeout(errorHideTimerRer.current);
        },
        [],
    );

    const actions = {
        registerUserRequest,
    };

    return <LoginFormContext.Provider value={{ state, actions }}>{children}</LoginFormContext.Provider>;
};

export { LoginFormContext, LoginFormContextProvider };
