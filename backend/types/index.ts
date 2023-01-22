import { Request } from 'express';
import { Document } from 'mongoose';

export interface IRequest extends Request {
    data?: {
        [key: string]: Document | null;
    };
    sanitize?: (...args: unknown[]) => string | unknown;
}

export interface IError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
