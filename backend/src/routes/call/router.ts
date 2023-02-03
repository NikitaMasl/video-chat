import { Router } from 'express';
import dataValidation from './dataValidation';
import schemaValidation from './schemaValidation';
import controller from './controller';
import { authMiddleware } from '../../common/auth';
import { Types as WithCallTypes, withCall } from '../../middlewares/withCall';

const router = Router();

router.get('/:callId', schemaValidation.getCall, withCall({ type: WithCallTypes.PARAMS_CALL_ID }), controller.getCall);

router.post('/create', authMiddleware, dataValidation.postCreateCall, controller.postCreateCall);

export default router;
