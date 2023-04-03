import Redis from 'ioredis';
import winston from 'winston';
import {
    IRedisClient,
    RedisPublishStreamOptions,
    RedisReadOptions,
    RedisWriteOptions,
    RedisConnectionOptions,
    RedisConsumeStreamInRangeOptions,
} from './types';

export class RedisClient implements IRedisClient {
    private _client: ReturnType<typeof Redis.createClient> | null;

    constructor(private readonly _logger: winston.LogMethod) {
        this._client = null;
    }

    public connect(options: RedisConnectionOptions): void {
        try {
            this._client = new Redis(options);

            // XADD with argument transformer to accept an object...
            Redis.Command.setArgumentTransformer('xadd', function (args) {
                if (args.length === 3) {
                    const argArray = [];

                    argArray.push(args[0], 'MAXLEN', '~', '10000', args[1]); // Stream name & max entities in stream & ID.

                    // Transform object into array of field name then value.
                    const fieldNameValuePairs = args[2];

                    for (const fieldName in fieldNameValuePairs) {
                        argArray.push(fieldName, fieldNameValuePairs[fieldName]);
                    }

                    return argArray;
                }

                return args;
            });

            Redis.Command.setReplyTransformer('xrange', function (result) {
                if (Array.isArray(result)) {
                    const newResult = [];
                    for (const r of result) {
                        const obj: Record<string, unknown> = {
                            id: r[0],
                        };

                        const fieldNamesValues = r[1];

                        for (let n = 0; n < fieldNamesValues.length; n += 2) {
                            const k = fieldNamesValues[n];
                            const v = fieldNamesValues[n + 1];
                            obj[k] = v;
                        }

                        newResult.push(obj);
                    }

                    return newResult;
                }

                return result;
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this._client?.xadd(streamKey, '*', data);
        } catch (e) {
            this._logger({
                level: 'error',
                message: `Redis publish failed for stream with key ${streamKey} with error ${e}`,
            });
        }
    }

    public async consumeStreamInRange<T>(options: RedisConsumeStreamInRangeOptions) {
        const { streamKey, rangeFromInMs = '-', rangeToInMs = '+' } = options;

        const items = await this._client?.xrange(streamKey, rangeFromInMs, rangeToInMs);

        return {
            key: streamKey,
            items: items as T,
        };
    }
}
