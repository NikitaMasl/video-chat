import HTTPStatus from 'http-status-codes';
import CommonErrors from '../../const/errors/common.errors';
import { ApiError } from './ApiError';

export class UnauthorizedError extends ApiError {
    constructor() {
        super(HTTPStatus.UNAUTHORIZED, CommonErrors.unauthorized);
    }
}
