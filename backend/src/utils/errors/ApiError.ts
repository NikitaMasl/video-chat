import { IError } from '../../../types';

export class ApiError extends Error {
    status: number;

    errors: IError[];

    constructor(status: number, ...errors: IError[]) {
        super();
        this.status = status;
        this.errors = errors;
    }
}
