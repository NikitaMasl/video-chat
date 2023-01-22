import { Router } from 'express';
import httpStatus from 'http-status-codes';

const router = Router();

const startedAt = new Date();

router.get('/', (req, res) => {
    res.status(httpStatus.OK).json({
        startedAt,
        serverTime: new Date(),
    });
});

export default router;
