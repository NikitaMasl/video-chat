import { IError } from '../../../../../types';
import UsersErrors from '../../../../const/errors/users.errors';
import User from '../../../../datasource/models/user.model';

type Options = {
    username?: string;
};

export const usernameShouldBeUnique = async ({ username }: Options): Promise<IError | null> => {
    const user = await User.findOne({ username });

    return user ? UsersErrors.userAlreadyExists : null;
};
