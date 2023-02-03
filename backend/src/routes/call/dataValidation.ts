import { IRequest } from '../../../types';
import { wrapAsyncMiddleware } from '../../middlewares/wrapAsyncMiddleware';
import { createDataValidator } from '../../utils/validators/data';
import { callShouldExists } from '../../utils/validators/data/call/callShouldExists';

const postCreateCall = wrapAsyncMiddleware(async (req: IRequest, res, next) => {
    // await createDataValidator()
    //     .addValidator(usernameShouldExists, {
    //         username: req.body?.username,
    //     })
    //     .validate();
    next();
});

export default { postCreateCall };
