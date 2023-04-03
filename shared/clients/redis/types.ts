export type RedisConnectionOptions = {
    port: number;
    host: string;
    username?: string;
    password?: string;
    db?: number;
};

export type RedisWriteOptions = {
    key: string;
    data: Record<string, unknown>;
    expireInMs?: number;
};

export type RedisReadOptions = {
    key: string;
};

export type RedisPublishStreamOptions = {
    streamKey: string;
    data: Record<string, unknown>;
};

export type RedisConsumeStreamInRangeOptions = {
    streamKey: string;
    rangeFromInMs?: number;
    rangeToInMs?: number;
};

export type RedisConsumeStreamInRangeReturnType<T> = {
    key: string;
    items: T[];
};

export interface IRedisClient {
    connect(options?: RedisConnectionOptions): void;
    write(options: RedisWriteOptions): Promise<void>;
    read(options: RedisReadOptions): Promise<Record<string, unknown> | null>;
    publishStream(options: RedisPublishStreamOptions): Promise<void>;
    consumeStreamInRange<T>(options: RedisConsumeStreamInRangeOptions): Promise<RedisConsumeStreamInRangeReturnType<T>>;
}
