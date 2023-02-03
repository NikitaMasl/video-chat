import { Response } from 'express';

interface Options {
    result?: unknown;
    errors?: unknown[];
}

export const sendResponse = async function sendResponse(
    res: Response,
    status: number,
    { result = {}, errors = [] }: Options,
    headers?: Record<string, string>,
): Promise<void> {
    const response = {
        success: result,
        errors,
    };
    if (headers) res.header(headers);

    res.status(status).json(response);
};
