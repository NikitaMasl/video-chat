import { Response } from 'express';
import HTTPStatus from 'http-status-codes';
import { IRequest } from '../../../types';
import { generateAccessToken } from '../../common/token';
import vars from '../../common/vars';
import { IUser } from '../../datasource/types';
import { wrapAsyncMiddleware } from '../../middlewares/wrapAsyncMiddleware';
import { create } from '../../services/users/create';
import { sendResponse } from '../../utils/http/sendResponse';

const DEFAULT_TOKEN_OPTIONS = Object.freeze({
    maxAge: vars.auth.accessTokenMaxAgeInMs,
    httpOnly: true,
    sameSite: true,
    secure: !vars.isLocal,
    signed: true,
    domain: vars.auth.domain,
});

const registerUser = wrapAsyncMiddleware(async (req: IRequest, res: Response) => {
    const { user } = await create({ data: req.body });

    const accessToken: string = generateAccessToken(user as unknown as IUser);

    res.cookie(vars.cookieName, accessToken, DEFAULT_TOKEN_OPTIONS);

    return sendResponse(res, HTTPStatus.OK, { result: { user } });
});

const getMe = wrapAsyncMiddleware(async (req: IRequest, res: Response) => {
    const { user } = req.data as { user: IUser };

    const result = {
        user: await user.toDto({}),
    };

    return sendResponse(res, HTTPStatus.OK, { result });
});

export default {
    registerUser,
    getMe,
};
