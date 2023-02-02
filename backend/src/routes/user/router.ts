import { Router } from 'express';
import schemaValidation from './schemaValidation';
import dataValidation from './dataValidation';
import controller from './controller';

const router = Router();

router.post('/register', schemaValidation.registerUser, dataValidation.postUserLogin, controller.registerUser);

export default router;
