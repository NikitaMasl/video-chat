const LOGIN_PAGE = '/login';

const CALL_ITEM_PAGE = ({ callId }: { callId: string }) => `/call/${callId}`;

const NOT_FOUND = '/404';

export { LOGIN_PAGE, NOT_FOUND, CALL_ITEM_PAGE };
