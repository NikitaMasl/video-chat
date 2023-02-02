import httpStatus from 'http-status-codes';
import { ApiError } from './ApiError';
import { IError } from '../../../types';

export class DataValidationError extends ApiError {
    constructor(errors: IError[] | null) {
        super(httpStatus.UNPROCESSABLE_ENTITY, ...(errors || []));
    }
}
