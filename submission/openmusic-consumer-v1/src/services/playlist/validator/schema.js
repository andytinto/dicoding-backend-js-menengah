import Joi from 'joi';

export const playlistPayloadSchema = Joi.object({
  name: Joi.string()
    .required(),
});

export const addSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string()
    .required(),
});

export const getPlaylistActivitiesPayloadSchema = Joi.object({
  id: Joi.string()
    .required(),
});

export const deletePlaylistPayloadSchema = Joi.object({
  songId: Joi.string()
    .length(16)
    .required(),
});