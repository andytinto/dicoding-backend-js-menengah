import Joi from 'joi';

export const playlistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});