import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useCreateCallMutation, useRegisterUserMutation } from 'app/store/api/apiService';
import { IError } from 'shared/api/const/type';
import { useRouter } from 'next/router';
import { CALL_ITEM_PAGE } from 'shared/const/url/CLIENT_PATHS';

type Props = {
    isJoin?: boolean;
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

const DEFAULT_STATE: State = {
    errorMessage: null,
    isLoading: false,
};

const HIDE_ERROR_TIMEOUT_IN_MS = 3000;

const LoginFormContext = React.createContext<ContextValue>({} as ContextValue);
const LoginFormContextProvider = (props: Props) => {
    const { isJoin, children } = props;

    const router = useRouter();

    const [state, setState] = useReducer((state: State, action: Partial<State>) => {
        return {
            ...state,
            ...action,
        };
    }, DEFAULT_STATE);

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
            if (isJoin && router.query.callId) {
                router.push(CALL_ITEM_PAGE({ callId: router.query.callId as string }));
            } else {
                createCallRequest({});
            }
        }
    }, [registerUserDataSuccess, router, isJoin, createCallRequest]);

    useEffect(() => {
        if (isRegisterUserLoading) {
            setState({ isLoading: true });
        }
    }, [isRegisterUserLoading]);

    useEffect(() => {
        if (registerUserDataError) {
            const error = registerUserDataError as unknown as IError;

            if (error?.data && error.data.errors?.length > 0) {
                setState({ errorMessage: error.data.errors[0].message });

                errorHideTimerRer.current = window.setTimeout(() => {
                    registerUserDataReset();
                    setState({ errorMessage: null });
                }, HIDE_ERROR_TIMEOUT_IN_MS);
            }

            setState({ isLoading: false });
        }
    }, [registerUserDataError]);

    useEffect(() => {
        if (createCallDataError) {
            const error = createCallDataError as unknown as IError;

            if (error?.data && error.data.errors?.length > 0) {
                setState({ errorMessage: error.data.errors[0].message });

                errorHideTimerRer.current = window.setTimeout(() => {
                    registerUserDataReset();
                    setState({ errorMessage: null });
                }, HIDE_ERROR_TIMEOUT_IN_MS);
            }

            setState({ isLoading: false });
        }
    }, [createCallDataError]);

    useEffect(() => {
        if (createCallDataSuccess) {
            setState({ isLoading: false });

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
