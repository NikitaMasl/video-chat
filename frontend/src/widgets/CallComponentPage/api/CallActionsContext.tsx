import React, { ReactElement, useCallback } from 'react';

interface ContextValue {
    actions: {
        copyLinkHandler: () => void;
    };
}

type Props = {
    children: ReactElement | ReactElement[];
    callId: string;
};

const CallActionsContext = React.createContext<ContextValue>({} as ContextValue);

const CallActionsContextProvider = (props: Props) => {
    const { children, callId } = props;

    const copyLinkHandler = useCallback(() => {
        console.log(callId);
    }, [callId]);

    const actions = {
        copyLinkHandler,
    };

    return <CallActionsContext.Provider value={{ actions }}>{children}</CallActionsContext.Provider>;
};

export { CallActionsContext, CallActionsContextProvider };
