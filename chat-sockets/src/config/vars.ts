import dotenv from 'dotenv';
import { parseString, parseNumber } from 'shared/utils/parsers';

dotenv.config();

export default {
    env: parseString(process.env.NODE_ENV, 'local'),
    port: parseNumber(process.env.PORT, 3003),
    rabbit: {
        user: parseString(process.env.RABBIT_USER, ''),
        pass: parseString(process.env.RABBIT_PASS, ''),
        host: parseString(process.env.RABBIT_HOST, ''),
    },
    redis: {
        port: parseNumber(process.env.REDIS_PORT, 16379),
        host: parseString(process.env.REDIS_HOST, 'localhost'),
        username: parseString(process.env.REDIS_USERNAME, 'redis'),
        password: parseString(process.env.REDIS_PASSWORD, 'Qwerty12345!'),
    },
    backendUrl: parseString(process.env.BACKEND_URL, 'http://localhost:8000'),
};
