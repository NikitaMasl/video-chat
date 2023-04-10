import { Message, Member, ChatHistoryState } from 'widgets/TextChat/types';
import { InitialRequestState } from 'widgets/TextChat/const/const';
import { createSlice } from '@reduxjs/toolkit';

interface TextChatState {
    messages: Message[];
    members: Member[];
    chatHistoryState: ChatHistoryState;
}

const initialState: TextChatState = {
    messages: [],
    members: [],
    chatHistoryState: {
        state: InitialRequestState.BEFORE_INITIAL_REQUEST,
        take: 50,
    },
};

export const textChatSlice = createSlice({
    name: 'textChat',
    initialState,
    reducers: {
        
    },
});

export default textChatSlice.reducer;
