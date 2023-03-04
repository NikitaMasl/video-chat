export enum CallEvents {
    JOIN = 'join',
    LEAVE = 'leave',
    SHARE_ROOMS = 'share-rooms',
    ADD_PEER = 'add-peer',
    REMOVE_PEER = 'remove-peer',
    RELAY_SDP = 'relay-sdp',
    RELAY_ICE = 'relay-ice',
    ICE_CANDIDATE = 'ice-candidate',
    SESSION_DESCRIPTION = 'session-description',
    MUTE_UNMUTE = 'mute-unmute',
}

export const CALL_EVENTS_ARRAY = Object.values(CallEvents);
