import Joi from 'joi';

export const listingSchemaValidate = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

export const reviewsSchemaValidate = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.string().required().min(0).max(5),
    }).required(),
});