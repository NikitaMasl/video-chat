import { IRequest } from '../../../types';
import { wrapAsyncMiddleware } from '../../middlewares/wrapAsyncMiddleware';
import { createDataValidator } from '../../utils/validators/data';
import { usernameShouldBeUnique } from '../../utils/validators/data/users/usernameShouldBeUnique';

const postUserLogin = wrapAsyncMiddleware(async (req: IRequest, res, next) => {
    await createDataValidator()
        .addValidator(usernameShouldBeUnique, {
            username: req.body?.username,
        })
        .validate();
    next();
});

export default { postUserLogin };
