export default {
    exchange: {
        TEXT_CHAT: {
            name: 'textChat',
            type: 'direct',
            options: {
                durable: true,
            },
            queues: {
                WRITE_TO_DB: {
                    name: 'textChat.writeToDb',
                    binding: 'textChat.writeToDb',
                    options: {
                        durable: true,
                    },
                },
            },
        },
        TEXT_CHAT_DELAY: {
            name: 'textChatDelay',
            type: 'direct',
            options: {
                durable: true,
                queueMode: 'lazy',
            },
            queues: {
                WRITE_TO_DB_DELAYED: {
                    name: 'textChatDelayed.writeToDb',
                    binding: 'textChat.writeToDb',
                    options: {
                        durable: true,
                        queueMode: 'lazy',
                        arguments: {
                            'x-dead-letter-exchange': 'textChat',
                        },
                    },
                },
            },
        },
        CALL: {
            name: 'call',
            type: 'direct',
            options: {
                durable: true,
            },
            queues: {
                NOBODY_IN_CALL: {
                    name: 'call.nobodyInCall',
                    binding: 'call.nobodyInCall',
                    options: {
                        durable: true,
                    },
                },
                JOIN_CALL: {
                    name: 'call.joinCall',
                    binding: 'call.joinCall',
                    options: {
                        durable: true,
                    },
                },
            },
        },
    },
};
