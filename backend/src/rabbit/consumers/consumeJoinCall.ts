import { RMQClient } from 'shared/clients/rabbitMQ';
import { ControllerOpt } from 'shared/clients/rabbitMQ/types';
import rabbitMQExchanges from 'shared/clients/rabbitMQ/exchanges';
import Call from '../../datasource/models/call.model';
import { ICall } from 'src/datasource/types';
import { writeMessagesToDBpublisher } from '../publishers/writeMessagesToDBpublisher';

const {
    exchange: {
        CALL: {
            queues: {
                JOIN_CALL: { name: queueName },
            },
        },
    },
} = rabbitMQExchanges;

const joinCallHandler = async (options: ControllerOpt) => {
    const {
        payload: { callId },
        msg,
        channel,
    } = options;

    const call = await Call.updateOne(
        {
            _id: callId,
        },
        {
            nobodyInCallSince: null,
            chatMessagesListenerWorks: true,
        },
    );

    // since we get doc before update
    if (!(call as unknown as ICall)?.chatMessagesListenerWorks) {
        writeMessagesToDBpublisher({ sentAtInMs: new Date().getTime(), callId });
    }

    channel.ack(msg);
};

export const initJoinCall = async (rabbitMQclient: RMQClient) => {
    rabbitMQclient.consume(queueName, joinCallHandler, 50);
};
