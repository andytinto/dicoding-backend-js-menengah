import Joi from 'joi';

export const createAlbumPayload = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
});

export const updateAlbumPayload = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
});