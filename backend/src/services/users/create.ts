import { IUser } from '../../datasource/types';
import User from '../../datasource/models/user.model';

type Options = {
    data: IUser;
};

type Result = {
    user: Record<string, unknown>;
};

export const create = async ({ data }: Options): Promise<Result> => {
    const user = await User.create({
        ...data,
    } as IUser);

    return {
        user: await user?.toDto({}),
    };
};
