const LOGIN_PAGE = '/login';

const CALL_ITEM_PAGE = ({ callId }: { callId: string }) => `/call/${callId}`;
const CALL_ITEM_JOIN_PAGE = ({ callId }: { callId: string }) => `${CALL_ITEM_PAGE({ callId })}/join`;

const NOT_FOUND = '/404';

export { LOGIN_PAGE, NOT_FOUND, CALL_ITEM_JOIN_PAGE, CALL_ITEM_PAGE };
