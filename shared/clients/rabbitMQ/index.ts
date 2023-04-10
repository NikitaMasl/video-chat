import amqp, { Connection, Options, ConsumeMessage, Channel } from 'amqplib';
import { IRMQClient, Exchange, Queue, GlobalOptions, ControllerOpt, PublisherOpt } from './types';
import { ConnectionState } from './const';
import winston from 'winston';
import { RMQClientError } from './errors';

export class RMQClient implements IRMQClient {
    private _connection: Connection | null;
    private _channel: Channel | null;

    constructor(
        public readonly exchanges: Record<string, Exchange>,
        private readonly _options: Options.Connect,
        private readonly _logger: winston.LogMethod,
    ) {
        this._connection = null;
        this._channel = null;
    }

    private async initExchanges(connection: Connection): Promise<void> {
        const channel = await connection.createChannel();

        channel.on('error', (e) => {
            this._logger({ level: 'error', message: `[RMQClient] channel error: ${e}` });
        });

        const exchanges = Object.values(this.exchanges);
        await Promise.all(
            exchanges.map(async (e) => {
                await channel.assertExchange(e.name, e.type, e.options);
                const queues = Object.values(e.queues);
                return Promise.all(
                    queues.map(async (q) => {
                        await channel.assertQueue(q.name, q.options);
                        await channel.bindQueue(q.name, e.name, q.binding);
                    }),
                );
            }),
        );
        await channel.close();
    }

    private objectToJsonBuffer(object: unknown) {
        const jsonObject = JSON.stringify(object);
        return Buffer.from(jsonObject);
    }

    private wrapMsgPayloadWithCatch(
        handler: ({ payload, msg, channel }: ControllerOpt) => Promise<void>,
        channel: Channel | null,
    ): (msg: ConsumeMessage | null) => void {
        return (msg) => {
            if (!msg) return;

            const jsonBody = msg.content.toString();
            const payload = JSON.parse(jsonBody);

            this._logger({ level: 'info', message: `[RMQClient] cunsumer recieved event with msg ${msg}` });

            handler({ payload, msg, channel: channel as Channel }).catch((e) => {
                const message =
                    `\t*1.Stack*:\n\t\`${e.stack}\`` +
                    '\n\t*2.Message info*:' +
                    `\n\t  \`exchange: ${msg.fields.exchange}` +
                    `\n\t  routingKey: ${msg.fields.routingKey}` +
                    `\n\t  redelivered: ${msg.fields.redelivered}\`` +
                    `\n\t*3.Message data*:\n\`${JSON.stringify(payload, null, '   ')}\`` +
                    `\n\t*4.Error*:\n\t\`${e.message}\`\n`;

                this._logger({ level: 'error', message: `[RMQClient] consuming failed with ${message}` });

                setTimeout(() => {
                    if (channel) channel.nack(msg);
                }, 10000);
            });
        };
    }

    public async connect(onConnectionStateChange?: (state: ConnectionState) => void): Promise<RMQClientError | void> {
        try {
            if (!this._connection) {
                this._logger({ level: 'info', message: `[RMQClient] trying to connect...` });
                this._connection = await amqp.connect(this._options);

                this._connection.on('error', (e) => {
                    this._logger({ level: 'error', message: `[RMQClient] error while connect to server: ${e}` });
                });

                this._connection.on('blocked', (reason) => {
                    this._logger({ level: 'error', message: `[RMQClient] Rabbit connection block by ${reason}` });
                    onConnectionStateChange?.(ConnectionState.BLOCKED);
                });

                this._connection.on('close', () => {
                    onConnectionStateChange?.(ConnectionState.DISCONNECED);
                });

                onConnectionStateChange?.(ConnectionState.CONNECTED);

                await this.initExchanges(this._connection);

                this._logger({ level: 'info', message: `[RMQClient] connected` });
            }
        } catch (error) {
            this._logger({ level: 'error', message: `[RMQClient] error while connect to server: ${error}` });
        }
    }

    public async publish(
        exchangeName: string,
        queue: Queue | null,
        globalOptions?: GlobalOptions,
        data?: unknown,
        options?: PublisherOpt,
    ): Promise<void> {
        const { expiration: gExpiration, persistent: gPersistent = true } = globalOptions || {};

        (async () => {
            const { expiration = gExpiration, persistent = gPersistent } = options || {};

            if (!this._connection) {
                this._logger({ level: 'error', message: `[RMQClient] publishing failed as no connection` });
                return;
            }

            if (!this._channel) {
                this._channel = await this._connection.createChannel();
            }

            const payload = this.objectToJsonBuffer(data || {});

            try {
                this._channel.publish(exchangeName, queue?.binding || '', payload, {
                    persistent,
                    expiration,
                });

                this._logger({
                    level: 'info',
                    message: `[RMQClient] msg successfully published to ${exchangeName} exchange`,
                });
            } catch (e) {
                this._logger({ level: 'error', message: `[RMQClient] publishing failed with error: ${e}` });
            }
        })();
    }

    public async consume(
        queueName: string,
        handler: ({ payload, msg, channel }: ControllerOpt) => Promise<void>,
        prefetch: number,
    ) {
        if (!this._connection) {
            this._logger({ level: 'error', message: `[RMQClient] consuming failed as no connection` });
            return;
        }

        const channel = await this._connection.createChannel();
        await channel.prefetch(prefetch, true);
        await channel.consume(queueName, this.wrapMsgPayloadWithCatch(handler, channel));
    }

    public async close() {
        if (this._connection) {
            await this._connection.close();
        }
    }
}
