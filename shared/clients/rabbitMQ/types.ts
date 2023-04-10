import { Channel, ConsumeMessage, Options } from 'amqplib';
import { ConnectionState } from './const';
import { RMQClientError } from './errors';

type Queue = {
    name: string;
    binding: string;
    options: Record<string, any>;
};

type GlobalOptions = {
    persistent?: boolean;
    expiration?: number;
};

type PublisherOpt = {
    expiration?: number;
    persistent?: boolean;
};

type ControllerOpt = {
    payload: any;
    msg: ConsumeMessage;
    channel: Channel;
};

type Exchange = {
    name: string;
    type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string;
    options?: Options.AssertExchange;
    queues: Record<string, Queue>;
};

interface IRMQClient {
    readonly exchanges: Record<string, Exchange>;

    connect(onConnectionStateChanged?: (state: ConnectionState) => void): Promise<RMQClientError | void>;
    publish(
        exchangeName: string,
        queue: Queue | null,
        globalOptions?: GlobalOptions,
        data?: unknown,
        options?: PublisherOpt,
    ): Promise<RMQClientError | void>;
    consume(
        queueName: string,
        handler: ({ payload, msg, channel }: ControllerOpt) => Promise<void>,
        prefetch: number,
        exchange: string,
    ): Promise<RMQClientError | void>;
    close(): Promise<void>;
}

export type { IRMQClient, Exchange, Queue, GlobalOptions, ControllerOpt, PublisherOpt };
