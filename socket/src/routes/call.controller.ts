import { CallEvents } from '../const/events/call.events';
import SocketTransport from '../utils/socket/SocketTransport';

const joinHandler = (socketTransport: SocketTransport, data: { callId: string }, responseCallback: any) => {
    const { callId } = data;
    const { socket, io } = socketTransport;

    socket.join(callId);

    console.log({ callId, socket });

    if (socket?.user?.id) {
        socket.join(`call_${callId}__user_${socket?.user?.id}`);
    }

    io.to(callId).emit(CallEvents.ADD_PEER, {
        peerID: socket?.user?.id,
    });
};

export default {
    joinHandler,
};
