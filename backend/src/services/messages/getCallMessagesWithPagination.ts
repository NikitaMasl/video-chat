import Message from '../../datasource/models/message.model';

type Options = {
    callId: string;
    limit: number;
    page: number;
};

export const getCallMessagesWithPagination = async (options: Options) => {
    const { callId, limit = 10, page = 1 } = options;

    const messages = await Message.find({
        callId,
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    return Promise.all(messages.map(async (m) => m.toDto()));
};
