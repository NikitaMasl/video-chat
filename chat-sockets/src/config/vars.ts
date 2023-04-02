import dotenv from 'dotenv';

dotenv.config();

export default {
    env: process.env.NODE_ENV || 'local',
    port: process.env.PORT || 3003,
    rabbit: {
        user: process.env.RABBIT_USER,
        pass: process.env.RABBIT_PASS,
        host: process.env.RABBIT_HOST,
    },
    backendUrl: process.env.BACKEND_URL || 'http://localhost:8000',
};
