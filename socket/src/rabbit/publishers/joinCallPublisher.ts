import { publishRabbitMQ } from '../index';
import rabbitMQExchanges from 'shared/clients/rabbitMQ/exchanges';

const {
    CALL: {
        name: exchangeName,
        queues: { JOIN_CALL },
    },
} = rabbitMQExchanges.exchange;

export const joinCallPublisher = ({ callId }: { callId: string }) => {
    publishRabbitMQ(exchangeName, JOIN_CALL, {}, { callId });
};
