import { getChatMessagesStreamName } from 'shared/utils/chat/getChatMessagesStreamName';
import type { Message } from 'shared/types';
import { EnhancedSocket } from '../types';
import SocketTransport from '../utils/socket/SocketTransport';
import { ChatEvents } from 'src/const/events/chat.events';

const BASE_PATH = 'chat:';

const joinHandler = async (socketTransport: SocketTransport, data: { callId: string }, responseCallback: any) => {
    const { callId } = data;
    const { socket, io } = socketTransport;

    socket.callId = callId;

    if (socket?.user?.id) {
        socket.join(`call_${callId}__user_${socket?.user?.id}`);
    }

    socket.join(callId);

    responseCallback(
        {
            peerId: socket?.user?.id,
        },
        null,
    );
};

const sendMessage = async (socketTransport: SocketTransport, data: { text: string }, responseCallback: any) => {
    const { text } = data;
    const {
        socket: { user, callId },
        io,
        redis,
    } = socketTransport;

    if (!user || !callId) {
        responseCallback(null, 'Anauthorized error');
        return;
    }

    const message: Message = {
        text,
        senderName: user.username || '',
        senderId: user.id || '',
    };

    redis.publishStream({ streamKey: getChatMessagesStreamName(callId), data: message });

    io.to(callId).emit(`${BASE_PATH}${ChatEvents.SEND_MESSAGE}`, { message });
};

export default {
    joinHandler,
    sendMessage,
};
