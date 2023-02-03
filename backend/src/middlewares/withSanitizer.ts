import { IRequest } from '../../types';
import { wrapAsyncMiddleware, WrapMiddleware } from './wrapAsyncMiddleware';

interface Options {
    req: IRequest;
    type: Types;
}
enum Types {
    QUERY = 'query',
    BODY = 'body',
}

async function getSanitazedFields({ req, type }: Options): Promise<any> {
    const keys = req[type as Types] ? Object.keys(req[type as Types]) : [];
    const result: any = {};
    keys.forEach((el) => {
        if (req.sanitize && typeof req[type as Types][el] === 'string') {
            result[el] = req.sanitize(req[type as Types][el]);
        } else {
            result[el] = req[type as Types][el];
        }
    });
    return result;
}

export const withSanitizer = (): WrapMiddleware =>
    wrapAsyncMiddleware(async (req: IRequest, _, next) => {
        req.body = req.body || {};
        req.query = req.query || {};

        req.body = await getSanitazedFields({ req, type: Types.BODY });
        req.query = await getSanitazedFields({ req, type: Types.QUERY });

        console.log('withSanitizer', { req });

        return next();
    });
