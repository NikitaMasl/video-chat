enum RMQCommonErrorIDs {
    UNKNOWN = 'unknown',
}

const RMQ_COMMON_ERROR = 'RabbitMQResponseError';

class RMQClientError extends Error {
    public readonly errorId: string;

    constructor(errorId: string, message: string) {
        super(message);
        this.errorId = errorId;
        this.name = RMQ_COMMON_ERROR;
    }

    public toString(): string {
        return `[${this.name}] - ${this.errorId}: ${this.message}`;
    }
}

export { RMQCommonErrorIDs, RMQClientError };
