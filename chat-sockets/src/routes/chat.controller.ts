import { CallEvents } from '../const/events/call.events';
import { EnhancedSocket } from '../types';
import { getUserInCallRoom } from '../utils/helpers/getUserInCallRoom';
import SocketTransport from '../utils/socket/SocketTransport';

const BASE_PATH = 'call:';

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

const sendMessage = async (socketTransport: SocketTransport, data: { callId: string }, responseCallback: any) => {
    const { callId } = data;
    const { socket, io } = socketTransport;

    responseCallback(
        {
            peerId: socket?.user?.id,
        },
        null,
    );
};

export default {
    joinHandler,
    sendMessage,
};
