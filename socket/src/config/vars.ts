import dotenv from 'dotenv';
import { parseString, parseNumber } from 'shared/utils/parsers';

dotenv.config();

export default {
    env: parseString(process.env.NODE_ENV, 'local'),
    port: parseNumber(process.env.PORT, 3002),
    rabbit: {
        user: parseString(process.env.RABBIT_USER, 'editor'),
        pass: parseString(process.env.RABBIT_PASS, 'Qwerty12345!'),
        host: parseString(process.env.RABBIT_HOST, 'localhost'),
        port: parseNumber(process.env.RABBIT_PORT, 5672),
    },
    backendUrl: parseString(process.env.BACKEND_URL, 'http://localhost:8000'),
};
