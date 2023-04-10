import { publishRabbitMQ } from '../index';
import rabbitMQExchanges from 'shared/clients/rabbitMQ/exchanges';

const {
    TEXT_CHAT: {
        name: exchangeName,
        queues: { WRITE_TO_DB },
    },
} = rabbitMQExchanges.exchange;

const DELAY_IN_MS = 5000;

export const writeMessagesToDBpublisher = ({ sentAtInMs, callId }: { sentAtInMs: number; callId: string }) => {
    publishRabbitMQ(exchangeName, WRITE_TO_DB, { expiration: DELAY_IN_MS }, { sentAtInMs, callId });
};
