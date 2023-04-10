import { RMQClient } from 'shared/clients/rabbitMQ';
import { ControllerOpt } from 'shared/clients/rabbitMQ/types';
import rabbitMQExchanges from 'shared/clients/rabbitMQ/exchanges';
import Call from '../../datasource/models/call.model';

const {
    exchange: {
        CALL: {
            queues: {
                NOBODY_IN_CALL: { name: queueName },
            },
        },
    },
} = rabbitMQExchanges;

const nobodyInCallHandler = async (options: ControllerOpt) => {
    const {
        payload: { callId, since },
        msg,
        channel,
    } = options;

    await Call.updateOne(
        {
            _id: callId,
        },
        {
            nobodyInCallSince: since,
        },
    );

    channel.ack(msg);
};

export const initNobodyInCall = async (rabbitMQclient: RMQClient) => {
    rabbitMQclient.consume(queueName, nobodyInCallHandler, 50);
};
