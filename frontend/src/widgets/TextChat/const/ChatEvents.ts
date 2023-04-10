export enum ChatEvents {
    JOIN = 'chat:join',
    SEND_MESSAGE = 'chat:sendMessage'
}

export const CHAT_EVENTS_ARRAY = Object.values(ChatEvents);
