import { createDataValidator } from 'src/utils/validators/data';
import { IRequest } from '../../../types';
import { wrapAsyncMiddleware } from '../../middlewares/wrapAsyncMiddleware';
import { callShouldExists } from 'src/utils/validators/data/call/callShouldExists';

const getCallMessages = wrapAsyncMiddleware(async (req: IRequest, res, next) => {
    const { callId } = req.params;

    await createDataValidator()
        .addValidator(callShouldExists, {
            callId,
        })
        .validate();
    next();
});

export default { getCallMessages };
