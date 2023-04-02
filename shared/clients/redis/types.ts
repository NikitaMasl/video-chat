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

export type RedisConsumeStreamOptions = {
    streamKey: string;
    callback: ({ id }: { id: string }) => Promise<void>;
};

export interface IRedisClient {
    connect(options?: RedisConnectionOptions): void;
    write(options: RedisWriteOptions): Promise<void>;
    read(options: RedisReadOptions): Promise<Record<string, unknown> | null>;
    publishStream(options: RedisPublishStreamOptions): Promise<void>;
    consumeStream(options: RedisConsumeStreamOptions): Promise<void>;
}
