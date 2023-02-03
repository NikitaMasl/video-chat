import Joi from 'joi';
import { validate } from 'express-validation';

const getCall = validate({
    params: Joi.object({
        callId: Joi.string().required(),
    }),
});

export default {
    getCall,
};
