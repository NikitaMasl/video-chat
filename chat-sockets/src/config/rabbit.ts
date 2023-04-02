export default {
    exchanges: {
        HELLO: {
            name: 'hello',
            type: 'direct',
            options: {
                durable: true,
            },
            queues: {
                WORLD: {
                    name: 'hello.world',
                    binding: 'hello.world',
                    options: {
                        durable: true,
                    },
                },
            },
        },
    },
};
