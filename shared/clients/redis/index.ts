import Redis from 'ioredis';
import winston from 'winston';
import {
    IRedisClient,
    RedisConsumeStreamOptions,
    RedisPublishStreamOptions,
    RedisReadOptions,
    RedisWriteOptions,
    RedisConnectionOptions,
} from './types';

export class RedisClient implements IRedisClient {
    private _client: ReturnType<typeof Redis.createClient> | null;

    constructor(private readonly _logger: winston.LogMethod) {
        this._client = null;
    }

    public connect(options: RedisConnectionOptions): void {
        const { port, host, ...restOptions } = options;

        try {
            this._client = new Redis(port, host, restOptions);

            // XADD with argument transformer to accept an object...
            Redis.Command.setArgumentTransformer('xadd', function (args) {
                if (args.length === 3) {
                    const argArray = [];

                    argArray.push(args[0], args[1]); // Key Name & ID.

                    // Transform object into array of field name then value.
                    const fieldNameValuePairs = args[2];

                    for (const fieldName in fieldNameValuePairs) {
                        argArray.push(fieldName, fieldNameValuePairs[fieldName]);
                    }

                    return argArray;
                }

                return args;
            });

            this._logger({ level: 'info', message: `Redis client succesfuly created` });
        } catch (e) {
            this._logger({ level: 'error', message: `Redis client creation failed with error ${e}` });
        }
    }

    public async write(options: RedisWriteOptions) {
        const { key, data, expireInMs } = options;

        try {
            if (expireInMs) {
                await this._client?.setex(key, expireInMs, JSON.stringify(data));
            } else {
                await this._client?.set(key, JSON.stringify(data));
            }
        } catch (e) {
            this._logger({ level: 'error', message: `Redis write failed for key ${key} with error ${e}` });
        }
    }

    public async read(options: RedisReadOptions) {
        const { key } = options;

        try {
            const res = await this._client?.get(key);

            return res ? JSON.parse(res) : null;
        } catch (e) {
            this._logger({ level: 'error', message: `Redis read failed for key ${key} with error ${e}` });
        }
    }

    public async publishStream(options: RedisPublishStreamOptions) {
        const { streamKey, data } = options;

        try {
            this._client?.xadd(streamKey, '*', JSON.stringify(data));
        } catch (e) {
            this._logger({
                level: 'error',
                message: `Redis publish failed for stream with key ${streamKey} with error ${e}`,
            });
        }
    }

    public async consumeStream(options: RedisConsumeStreamOptions) {
        const { streamKey, callback } = options;

        this._client?.xread('COUNT', 0, 'STREAMS', streamKey, '$', (err: any, stream: any) => {
            if (err) {
                this._logger({
                    level: 'error',
                    message: `Redis consume failed for stream with key ${streamKey} with error ${err}`,
                });
            }
            console.log({ stream });
            if (stream) {
                const messages = stream[0][1];
                messages.forEach((message: any) => {
                    const id = message[0];
                    const values = message[1];
                    const msgObject = { id: id };

                    console.log({ values });

                    // for (let i = 0; i < values.length; i = i + 2) {
                    //     msgObject[values[i]] = values[i + 1];
                    // }

                    callback(msgObject);
                });
            } else {
                // No message in the consumer buffer
                console.log('No new message...');
            }
        });
    }
}
