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

    io.to(callId).emit(`${BASE_PATH}${CallEvents.ADD_PEER}`, {
        peerId: socket?.user?.id,
        createOffer: false,
    });

    const clients = Object.values(io.in(callId).sockets);

    (clients as EnhancedSocket[]).forEach((s) => {
        if (s?.user?.id !== socket.user?.id) {
            socket.emit(`${BASE_PATH}${CallEvents.ADD_PEER}`, {
                peerId: s?.user?.id,
                createOffer: true,
            });
        }
    });

    responseCallback(
        {
            peerId: socket?.user?.id,
        },
        null,
    );
};

const relayIceHandler = (socketTransport: SocketTransport, data: { peerId: string; iceCandidate: RTCIceCandidate }) => {
    const { peerId, iceCandidate } = data;
    const { io, socket } = socketTransport;

    if (!socket?.callId) {
        return;
    }

    socket.to(getUserInCallRoom(peerId, socket.callId)).emit(`${BASE_PATH}${CallEvents.ICE_CANDIDATE}`, {
        peerId: socket?.user?.id,
        iceCandidate,
    });
};

const relaySdpHandler = (
    socketTransport: SocketTransport,
    data: { peerId: string; sessionDescription: RTCSessionDescriptionInit },
) => {
    const { peerId, sessionDescription } = data;
    const { socket } = socketTransport;

    if (!socket?.callId) {
        return;
    }

    socket.to(`user_${peerId}`).emit(`${BASE_PATH}${CallEvents.SESSION_DESCRIPTION}`, {
        peerId: socket?.user?.id,
        sessionDescription,
    });
};

const leaveHandler = (socketTransport: SocketTransport) => {
    const { io, socket } = socketTransport;

    if (socket.callId) {
        io.to(socket.callId).emit(`${BASE_PATH}${CallEvents.REMOVE_PEER}`, { peerId: socket?.user?.id });
    }

    socket.leaveAll();
};

const muteUnmuteHandler = (socketTransport: SocketTransport, data: { isMicMuted: boolean }) => {
    const { io, socket } = socketTransport;
    const { isMicMuted } = data;

    if (socket.callId) {
        io.to(socket.callId).emit(`${BASE_PATH}${CallEvents.MUTE_UNMUTE}`, { peerId: socket?.user?.id, isMicMuted });
    }
};

export default {
    joinHandler,
    relayIceHandler,
    relaySdpHandler,
    leaveHandler,
    muteUnmuteHandler,
};
