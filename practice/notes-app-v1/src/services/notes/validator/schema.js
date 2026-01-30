import Joi from 'joi';

export const notePayloadSchema = Joi.object({
  title: Joi.string().max(100).required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const noteUpdatePayloadSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  body: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
}).min(1);
