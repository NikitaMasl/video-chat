import dotenv from 'dotenv';
import { parseString, parseNumber, parseBoolean } from 'shared/utils/parsers';

dotenv.config();

const vars = {
    env: parseString(process.env.NODE_ENV, 'local'),
    port: parseNumber(process.env.PORT, 8000),
    clientUrl: parseString(process.env.CLIENT_URL, 'http://localhost:3000'),
    isLocal: parseBoolean(process.env.IS_LOCAL, true),
    mongo: {
        url: parseString(process.env.MONGO_URL, 'mongodb://localhost:27020/video-chat/?replicaSet=rs0'),
    },
    cookieName: process.env.COOKIE_NAME || 'VideoChatAccessToken',
    auth: {
        jwtSecret: parseString(process.env.USERS_AUTH_JWTSECRET, '123456'),
        cookieSecret: parseString(process.env.USERS_AUTH_COOKIESECRET, '123456'),
        accessTokenMaxAgeInMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: parseString(process.env.COOKIE_DOMAIN, 'localhost'),
    },
    redis: {
        port: parseNumber(process.env.REDIS_PORT, 16379),
        host: parseString(process.env.REDIS_HOST, 'localhost'),
        username: parseString(process.env.REDIS_USERNAME, 'redis'),
        password: parseString(process.env.REDIS_PASSWORD, 'Qwerty12345!'),
    },
};

export default vars;
