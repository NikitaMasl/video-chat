// USER
export const USER_API = '/user';

export const USER_REGISTER = `${USER_API}/register`;

// CALL
export const CALL_API = '/call';

export const CALL_CREATE = `${CALL_API}/create`;
export const CALL_GET_ITEM = ({ id }: { id: string }) => `${CALL_API}/${id}`;
