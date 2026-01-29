import InvariantError from '../../../exceptions/invariant-error.js';
import songRepositories from '../repositories/song-repositories.js';
import response from '../../../utils/response.js';

export const healthCheck = (req, res) => res.json({
  status: 'success',
  data: { message: 'OK' },
});

export const createSongs = async (req, res, next) => {
  try {
    const { title, year, genre, performer, duration, albumId } = req.body ?? {};

    const song = await songRepositories.createSongs({ title, year, genre, performer, duration, albumId });

    if (!song) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return response(res, 201, null, {
      songId: song.id,
    });
  } catch (error) {
    next(error);
  }
};
