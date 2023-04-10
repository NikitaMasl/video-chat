import { Response } from 'express';
import HTTPStatus from 'http-status-codes';
import { wrapAsyncMiddleware } from 'src/middlewares/wrapAsyncMiddleware';
import { sendResponse } from 'src/utils/http/sendResponse';
import { IRequest } from '../../../types';
import { getCallMessagesWithPagination } from 'src/services/messages/getCallMessagesWithPagination';

const getCallMessages = wrapAsyncMiddleware(async (req: IRequest, res: Response) => {
    const { callId } = req.params;
    const { limit, page } = req.query;

    const messages = await getCallMessagesWithPagination({
        callId,
        limit: Number(limit),
        page: Number(page),
    });

    return sendResponse(res, HTTPStatus.OK, { result: {} });
});

export default {
    getCallMessages,
};
