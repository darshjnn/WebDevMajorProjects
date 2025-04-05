import Joi from 'joi';

export const reviewsSchemaValidate = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.string().required().min(0).max(5),
    }).required(),
});