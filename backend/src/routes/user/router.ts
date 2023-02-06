import { Router } from 'express';
import schemaValidation from './schemaValidation';
import dataValidation from './dataValidation';
import controller from './controller';
import { authMiddleware } from '../../common/auth';

const router = Router();

router.post('/register', schemaValidation.registerUser, dataValidation.postUserLogin, controller.registerUser);

router.get('/me', authMiddleware, controller.getMe);

export default router;
