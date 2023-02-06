export enum CallEvents {
    JOIN = 'call:join',
    LEAVE = 'call:leave',
    SHARE_ROOMS = 'call:share-rooms',
    ADD_PEER = 'call:add-peer',
    REMOVE_PEER = 'call:remove-peer',
    RELAY_SDP = 'call:relay-sdp',
    RELAY_ICE = 'call:relay-ice',
    ICE_CANDIDATE = 'call:ice-candidate',
    SESSION_DESCRIPTION = 'call:session-description',
}

export const CALL_EVENTS_ARRAY = Object.values(CallEvents);
