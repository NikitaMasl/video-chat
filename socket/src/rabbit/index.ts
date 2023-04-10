import winston from 'winston';
import { RMQClient } from 'shared/clients/rabbitMQ';
import rabbitMAExchanges from 'shared/clients/rabbitMQ/exchanges';
import vars from '../config/vars';
import { GlobalOptions, PublisherOpt, Queue } from 'shared/clients/rabbitMQ/types';
// import consumers from './consumers';

const {
    rabbit: { user, pass, host, port },
} = vars;

let rabbitmqClient: RMQClient | null = null;

const initRabbitMQ = async (log: winston.LogMethod) => {
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

    // await Promise.all(
    //     Object.keys(consumers).map(async (consumerKey) => {
    //         await consumers[consumerKey as keyof typeof consumers](rabbitmqClient as RMQClient);
    //     }),
    // );
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
