import Joi from 'joi';
import { validate } from 'express-validation';

const getCallMessages = validate({
    params: Joi.object({
        callId: Joi.string().required(),
    }),
    query: Joi.object({
        limit: Joi.number().integer().min(1).max(100).default(10),
        page: Joi.number().integer().min(1).default(1),
    }),
});

export default {
    getCallMessages,
};
