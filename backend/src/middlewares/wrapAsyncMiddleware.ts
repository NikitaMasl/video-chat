import { Response, NextFunction } from 'express';
import { IRequest } from '../../types';

export type WrapMiddleware = (req: IRequest, res: Response, next: NextFunction) => void;

type Middleware = (req: IRequest, res: Response, next: NextFunction) => Promise<unknown>;

export const wrapAsyncMiddleware = (middleware: Middleware): WrapMiddleware => (
    req: IRequest,
    res: Response,
    next: NextFunction,
): void => {
    middleware(req, res, next).catch(next);
};
