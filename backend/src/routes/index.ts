import { Router } from 'express';
import httpStatus from 'http-status-codes';

import userRouter from './user/router';
import callRouter from './call/router';

const router = Router();

const startedAt = new Date();

router.get('/', (req, res) => {
    res.status(httpStatus.OK).json({
        startedAt,
        serverTime: new Date(),
    });
});

router.use('/user', userRouter);
router.use('/call', callRouter);

export default router;
