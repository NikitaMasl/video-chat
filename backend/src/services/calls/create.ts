import { ICall, IUser } from '../../datasource/types';
import Call from '../../datasource/models/call.model';

type Result = {
    call: Record<string, unknown>;
};

type Options = {
    owner: String;
};

export const create = async (data: Options): Promise<Result> => {
    const call = await Call.create(data as ICall);

    return {
        call: await call?.toDto({}),
    };
};
