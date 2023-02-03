import HTTPStatus from 'http-status-codes';
import CommonErrors from '../../const/errors/common.errors';
import { ApiError } from './ApiError';

export class NotFoundError extends ApiError {
    constructor() {
        super(HTTPStatus.NOT_FOUND, CommonErrors.notFound);
    }
}
