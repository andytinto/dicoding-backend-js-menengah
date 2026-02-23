import Joi from 'joi';

export const createAlbumPayload = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
});

export const updateAlbumPayload = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
});

export const createSongsPayload = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number()
    .integer()
    .positive()
    .allow(null),
  albumId: Joi.string()
    .allow(null),
});

export const updateSongsPayload = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().positive().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().positive().allow(null),
  albumId: Joi.string().allow(null)
});

export const likeAlbumPayload = Joi.object({
  songId: Joi.string()
    .length(16)
    .required(),
});

export const getLikeAlbumPayload = Joi.object({
  songId: Joi.string()
    .length(16)
    .required(),
});

export const unlikeAlbumPayload = Joi.object({
  songId: Joi.string()
    .length(16)
    .required(),
});