import { IRequest } from '../../types';
import { ICall } from '../datasource/types';
import { NotFoundError } from '../utils/errors/NotFoundError';
import Call from '../datasource/models/call.model';
import { wrapAsyncMiddleware, WrapMiddleware } from './wrapAsyncMiddleware';

export enum Types {
    QUERY_CALL_ID = 'query_call_id',
    BODY_CALL_ID = 'body_call_id',
    PARAMS_CALL_ID = 'params_call_id',
}

interface Options {
    req: IRequest;
    type?: Types;
    dataField?: string;
}

async function getCallByType({ req, type }: Options): Promise<ICall | null> {
    switch (type) {
        case Types.PARAMS_CALL_ID:
        case req.params?.callId:
            return Call.findById(req.params.callId as string);
        default:
            return null;
    }
}

export const withCall = ({ type = Types.PARAMS_CALL_ID, dataField = 'call', isRequired = true } = {}): WrapMiddleware =>
    wrapAsyncMiddleware(async (req: IRequest, _, next) => {
        req.data = req.data || {};
        const call = await getCallByType({ req, type });

        if (call) {
            req.data[dataField] = call;
            return next();
        }

        if (!isRequired) {
            return next();
        }

        throw NotFoundError;
    });
