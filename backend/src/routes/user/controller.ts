import { Response } from 'express';
import HTTPStatus from 'http-status-codes';
import { IRequest } from '../../../types';
import { wrapAsyncMiddleware } from '../../middlewares/wrapAsyncMiddleware';
import { create } from '../../services/users/create';
import { sendResponse } from '../../utils/http/sendResponse';

const registerUser = wrapAsyncMiddleware(async (req: IRequest, res: Response) => {
    console.log({ body: req.body });
    const user = await create({ data: req.body });

    return sendResponse(res, HTTPStatus.OK, { result: { user } });
});

export default {
    registerUser,
};
