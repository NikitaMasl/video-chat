import Joi from 'joi';
import { validate } from 'express-validation';

const registerUser = validate({
    body: Joi.object({
        username: Joi.string().required(),
    }),
});

export default {
    registerUser,
};
