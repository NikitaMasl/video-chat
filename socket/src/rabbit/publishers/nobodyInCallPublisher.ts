import { publishRabbitMQ } from '../index';
import rabbitMAExchanges from 'shared/clients/rabbitMQ/exchanges';

const {
    CALL: {
        name: exchangeName,
        queues: { NOBODY_IN_CALL },
    },
} = rabbitMAExchanges.exchange;

export const nobodyInCallPublisher = ({ since, callId }: { since: number; callId: string }) => {
    publishRabbitMQ(exchangeName, NOBODY_IN_CALL, {}, { since, callId });
};
