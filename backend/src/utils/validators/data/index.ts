import { IError } from '../../../../types';
import { DataValidationError } from '../../errors/DataValidationError';

interface Options {
    [key: string]: unknown;
}

export type Validator = (options: Options) => Promise<IError | null>;

interface IValidator {
    validator: Validator;
    data: Options;
}

class DataValidator {
    validators: IValidator[];

    constructor() {
        this.validators = [];
    }

    public addValidator(validator: Validator, data: Options) {
        this.validators.push({
            validator,
            data,
        });
        return this;
    }

    public async validate() {
        const validators = this.validators.map((v) => v.validator(v.data));
        const errors = await Promise.all(validators);
        if (errors) {
            const notEmptyErrors: unknown[] = errors.filter((e) => e);
            if (notEmptyErrors.length) {
                throw new DataValidationError(<IError[]>notEmptyErrors);
            }
        }
        return this;
    }
}

export const createDataValidator = (): DataValidator => new DataValidator();
