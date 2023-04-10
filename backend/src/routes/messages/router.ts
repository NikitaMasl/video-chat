import { Router } from 'express';
import { authMiddleware } from '../../common/auth';
import controller from './controller';
import schemaValidation from './schemaValidation';
import dataValidation from './dataValidation';

const router = Router();

router.get(
    '/:callId',
    authMiddleware,
    schemaValidation.getCallMessages,
    dataValidation.getCallMessages,
    controller.getCallMessages,
);

export default router;
