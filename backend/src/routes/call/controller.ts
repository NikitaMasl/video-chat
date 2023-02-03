import { Response } from 'express';
import HTTPStatus from 'http-status-codes';
import { IRequest } from '../../../types';
import { wrapAsyncMiddleware } from '../../middlewares/wrapAsyncMiddleware';
import { create } from '../../services/calls/create';
import { sendResponse } from '../../utils/http/sendResponse';

const postCreateCall = wrapAsyncMiddleware(async (req: IRequest, res: Response) => {
    const { data } = req;

    const { call } = await create({ owner: data?.user?._id });

    return sendResponse(res, HTTPStatus.OK, { result: { call } });
});

const getCall = wrapAsyncMiddleware(async (req: IRequest, res: Response) => {
    const { data } = req;

    return sendResponse(res, HTTPStatus.OK, { result: { call: data?.call } });
});

export default {
    postCreateCall,
    getCall,
};
