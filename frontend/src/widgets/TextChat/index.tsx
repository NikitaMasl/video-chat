import React, { useRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import { Grid } from 'shared/UI/Grid';
import MessagesList from './UI/MessagesList';
import TextChatInput from './UI/TextChatInput';
import { InitialRequestState } from './const/const';
import { ChatSocketsContextProvider } from './lib/ChatSocketsContext';

const TextChat = () => {
    const editorRef = useRef<Editor | null>(null);

    const handleSendMessage = (text: string) => {
        console.log({ text });
    };

    return <div>TEST</div>;

    return (
        <Grid justifyContent="center" direction="column" alignItems="center">
            <MessagesList
                chatMessages={[]}
                currentUserId={'test'}
                usersMap={new Map()}
                requestHistoryState={{
                    state: InitialRequestState.BEFORE_INITIAL_REQUEST,
                    oldestMessageDate: new Date(),
                    newestMessageDate: new Date(),
                    lastReadDate: new Date(),
                    take: 50,
                }}
                isGetChatMessagesInProcessing={false}
                onGetMoreMessages={() => {
                    console.log('onGetMoreMessages call');
                }}
            />
            <TextChatInput editorRef={editorRef} onSendMessage={handleSendMessage} />
        </Grid>
    );
};

const PrefetchWrapper = ({ callId }: { callId: string }) => {
    return (
        <ChatSocketsContextProvider callId={callId}>
            <TextChat />
        </ChatSocketsContextProvider>
    );
};

export default React.memo(PrefetchWrapper);
