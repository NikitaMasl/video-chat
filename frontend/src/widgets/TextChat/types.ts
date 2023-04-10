import { InitialRequestState } from './const/const';

type ChatHistoryState = {
    state: InitialRequestState;
    oldestMessageDate?: Date;
    newestMessageDate?: Date;
    lastReadDate?: Date;
    take: number;
};

type Member = {
    id: string;
    username: string;
};

type Message = {
    id: string;
    senderId: string;
    text: string;
    sentAt: Date;
};

type GetChatHistoryParams = {
    take: number;
    lastMessageDate?: Date;
};

export type { Message, ChatHistoryState, GetChatHistoryParams, Member };
