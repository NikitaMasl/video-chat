import winston from 'winston';
import { RMQClient } from 'shared/clients/rabbitMQ';
import rabbitMAExchanges from 'shared/clients/rabbitMQ/exchanges';
import vars from '../common/vars';
import { GlobalOptions, PublisherOpt, Queue } from 'shared/clients/rabbitMQ/types';
import redisConsumers from './redisConsumers';
import commonConsumers from './consumers';
import { RedisClient } from 'shared/clients/redis';

const {
    rabbit: { user, pass, host, port },
} = vars;

let rabbitmqClient: RMQClient | null = null;

const initRabbitMQ = async (log: winston.LogMethod, redis: RedisClient) => {
    rabbitmqClient = new RMQClient(
        rabbitMAExchanges.exchange,
        {
            username: user,
            password: pass,
            hostname: host,
            port,
        },
        log,
    );

    await Promise.all(
        Object.keys(commonConsumers).map(async (consumerKey) => {
            await commonConsumers[consumerKey as keyof typeof commonConsumers](rabbitmqClient as RMQClient);
        }),
    );

    await Promise.all(
        Object.keys(redisConsumers).map(async (consumerKey) => {
            await redisConsumers[consumerKey as keyof typeof redisConsumers](rabbitmqClient as RMQClient, redis);
        }),
    );
};

const closeRabbitMQ = async () => {
    if (!rabbitmqClient) {
        return;
    }

    rabbitmqClient.close();
    rabbitmqClient = null;
};

const publishRabbitMQ = (
    exchangeName: string,
    queue: Queue | null,
    globalOptions?: GlobalOptions,
    data?: unknown,
    options?: PublisherOpt,
) => {
    if (!rabbitmqClient) {
        return;
    }

    rabbitmqClient.publish(exchangeName, queue, globalOptions, data, options);
};

export { publishRabbitMQ, initRabbitMQ, closeRabbitMQ };
