import _ from 'lodash';
import httpStatus from 'http-status-codes';
import { Response, NextFunction } from 'express';
import { ValidationError } from 'express-validation';
import { ApiError } from '../utils/errors/ApiError';
import { sendResponse } from '../utils/http/sendResponse';
import { IRequest } from '../../types';
import { log } from '../common/logger';
import CommonErrors from '../const/errors/common.errors';

function processValidationErrors(err: ValidationError) {
    console.log({ err });
    const errors = _.flatten(Object.values(err.details));
    const formattedErrors = errors.map((e) => {
        const {
            context: { key },
        } = e;

        log({
            level: 'error',
            message: e.message,
        });

        return {
            code: `${key}__${e.type.replace(/\./g, '_')}`,
            message: e.message,
        };
    });

    return {
        errors: formattedErrors,
    };
}

function processError(err: ValidationError | ApiError) {
    console.log({ err });
    if (err instanceof ValidationError) {
        const { errors } = processValidationErrors(err);
        return {
            errors,
            status: httpStatus.UNPROCESSABLE_ENTITY,
        };
    }

    if (err instanceof ApiError) {
        return err;
    }

    return {
        errors: [CommonErrors.service],
        status: httpStatus.INTERNAL_SERVER_ERROR,
    };
}

async function handler(
    err: ValidationError | ApiError,
    req: IRequest,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
): Promise<void> {
    const error = processError(err);

    await sendResponse(res, error.status, { errors: error.errors });
}

export default {
    handler,
};
