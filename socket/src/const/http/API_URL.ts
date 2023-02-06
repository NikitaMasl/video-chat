import vars from '../../config/vars';

const { backendUrl } = vars;

const api = 'api';

export const USER_API = `${backendUrl}/${api}/user`;

export const AUTH_USER = `${USER_API}/me`;
