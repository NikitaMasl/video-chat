import React, { ReactElement, useCallback } from 'react';
import { CALL_ITEM_JOIN_PAGE } from 'shared/const/url/CLIENT_PATHS';
import { copyText } from 'shared/lib/utils/copyText';

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
        copyText(`${window.location.origin}${CALL_ITEM_JOIN_PAGE({ callId })}`);
    }, [callId]);

    const actions = {
        copyLinkHandler,
    };

    return <CallActionsContext.Provider value={{ actions }}>{children}</CallActionsContext.Provider>;
};

export { CallActionsContext, CallActionsContextProvider };
