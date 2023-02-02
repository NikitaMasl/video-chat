export interface IError {
    status: string;
    data: {
        errors: {
            code: string;
            message: string;
        }[];
    };
}
