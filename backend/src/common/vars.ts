import dotenv from 'dotenv';
import { parseBoolean } from '../utils/parsers/parseBoolean';
import { parseNumber } from '../utils/parsers/parseNumber';
import { parseString } from '../utils/parsers/parseString';

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
};

export default vars;
