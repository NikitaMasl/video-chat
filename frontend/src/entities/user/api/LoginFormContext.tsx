import React, { useEffect, useState, useRef } from 'react';
import { useCreateCallMutation, useRegisterUserMutation } from 'app/store/api/apiService';
import { IError } from 'shared/api/const/type';
import { useRouter } from 'next/router';
import { CALL_ITEM_PAGE } from 'shared/const/url/CLIENT_PATHS';

type Props = {
    children: React.ReactNode;
};

type State = {
    errorMessage: string | null;
    isLoading: boolean;
};

interface ContextValue {
    state: State;
    actions: {
        [key: string]: (...args: unknown[]) => unknown;
    };
}

const DEFAULT_STATE = {
    errorMessage: null,
    isLoading: false,
};

const HIDE_ERROR_TIMEOUT_IN_MS = 3000;

const LoginFormContext = React.createContext<ContextValue>({} as ContextValue);
const LoginFormContextProvider = (props: Props) => {
    const { children } = props;

    const router = useRouter();

    const [state, setState] = useState<State>(DEFAULT_STATE);

    const errorHideTimerRer = useRef(0);

    const [
        registerUserRequest,
        {
            data: registerUserDataSuccess,
            isLoading: isRegisterUserLoading,
            error: registerUserDataError,
            reset: registerUserDataReset,
        },
    ] = useRegisterUserMutation({});

    const [createCallRequest, { data: createCallDataSuccess, error: createCallDataError, reset: createCallDataReset }] =
        useCreateCallMutation();

    useEffect(() => {
        if (registerUserDataSuccess) {
            createCallRequest({});
        }
    }, [registerUserDataSuccess]);

    useEffect(() => {
        if (isRegisterUserLoading) {
            setState((p) => ({ ...p, isLoading: true }));
        }
    }, [isRegisterUserLoading]);

    useEffect(() => {
        if (registerUserDataError) {
            const error = registerUserDataError as unknown as IError;

            if (error?.data && error.data.errors?.length > 0) {
                setState((p) => ({ ...p, errorMessage: error.data.errors[0].message }));

                errorHideTimerRer.current = window.setTimeout(() => {
                    registerUserDataReset();
                    setState((p) => ({ ...p, errorMessage: null }));
                }, HIDE_ERROR_TIMEOUT_IN_MS);
            }

            setState((p) => ({ ...p, isLoading: false }));
        }
    }, [registerUserDataError]);

    useEffect(() => {
        if (createCallDataError) {
            const error = createCallDataError as unknown as IError;

            if (error?.data && error.data.errors?.length > 0) {
                setState((p) => ({ ...p, errorMessage: error.data.errors[0].message }));

                errorHideTimerRer.current = window.setTimeout(() => {
                    registerUserDataReset();
                    setState((p) => ({ ...p, errorMessage: null }));
                }, HIDE_ERROR_TIMEOUT_IN_MS);
            }

            setState((p) => ({ ...p, isLoading: false }));
        }
    }, [createCallDataError]);

    useEffect(() => {
        if (createCallDataSuccess) {
            setState((p) => ({ ...p, isLoading: false }));

            router.push(CALL_ITEM_PAGE({ callId: createCallDataSuccess.success.call.id }));
        }
    }, [createCallDataSuccess]);

    useEffect(
        () => () => {
            registerUserDataReset();
            createCallDataReset();

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
