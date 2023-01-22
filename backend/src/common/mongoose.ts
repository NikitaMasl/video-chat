import mongoose, { Connection } from 'mongoose';
import vars from './vars';
import { log } from './logger';

const { mongo, env } = vars;

const RECONNECT_TIMEOUT = 15000;

mongoose.Promise = Promise;

if (env === 'development') {
    mongoose.set('debug', true);
}

async function connect(): Promise<Connection> {
    log({ level: 'info', message: `Mongo connected to ${mongo.url}` });
    await mongoose.connect(<string>mongo.url, {
        autoCreate: true,
        autoIndex: true,
    });
    const { connection } = mongoose;
    return connection;
}

mongoose.connection.on('error', (err) => {
    log({ level: 'info', message: `MongoDB connection error: ${err}` });
    setTimeout(connect, RECONNECT_TIMEOUT);
});

export default {
    connect,
};
