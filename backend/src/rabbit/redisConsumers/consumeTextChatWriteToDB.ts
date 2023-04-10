import { RMQClient } from 'shared/clients/rabbitMQ';
import { ControllerOpt } from 'shared/clients/rabbitMQ/types';
import rabbitMQExchanges from 'shared/clients/rabbitMQ/exchanges';
import { RedisClient } from 'shared/clients/redis';
import { getChatMessagesStreamName } from 'shared/utils/chat/getChatMessagesStreamName';
import { Message } from 'shared/types';
import { writeMessagesToDBpublisher } from '../publishers/writeMessagesToDBpublisher';
import Call from '../../datasource/models/call.model';

const {
    exchange: {
        TEXT_CHAT: {
            queues: {
                WRITE_TO_DB: { name: queueName },
            },
        },
    },
} = rabbitMQExchanges;

const textChatWriteToDBHandler = async ({ options, redis }: { options: ControllerOpt; redis: RedisClient }) => {
    const {
        payload: { sentAtInMs, callId },
        msg,
        channel,
    } = options;

    console.log({ sentAtInMs, callId, msg, channel });

    try {
        const now = new Date().getTime();
        const streamKey = getChatMessagesStreamName(callId);

        const { items } = await redis.consumeStreamInRange<Message[]>({
            streamKey,
            rangeFromInMs: sentAtInMs,
            rangeToInMs: now,
        });

        console.log({ items });

        const call = await Call.findById(callId);

        if (call && (!call.nobodyInCallSince || new Date(call.nobodyInCallSince).getTime() > now)) {
            writeMessagesToDBpublisher({ sentAtInMs: now, callId });
        } else {
            await Call.updateOne(
                {
                    _id: callId,
                },
                {
                    chatMessagesListenerWorks: false,
                },
            );
        }
        channel.ack(msg);
    } catch (e) {
        console.log('textChatWriteToDBHandler', { e });
    }
};

export const initTextChatWriteToDB = async (rabbitMQclient: RMQClient, redis: RedisClient) => {
    rabbitMQclient.consume(
        queueName,
        async (options: ControllerOpt) => textChatWriteToDBHandler({ options, redis }),
        50,
    );
};
