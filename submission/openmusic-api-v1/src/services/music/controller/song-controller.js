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

export const getSongs = async (req, res, next) => {
  try {
    const songs = await songRepositories.getSongs();
    return response(res, 200, null, { songs: songs });
  } catch (error) {
    next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await songRepositories.getSongById(id);
    if (!song) {
      return response(res, 404, 'Lagu tidak ditemukan');
    }

    return response(res, 200, null, { song : {
      id: song.id,
      title: song.title,
      year: song.year,
      genre: song.genre,
      performer: song.performer,
      duration: song.duration,
      albumId: song.album_id,
    }
    });
  } catch (error) {
    next(error);
  }
};

export const getSongByWithFilter = async (req, res, next) => {
  try {
    console.log('QUERY CONTROLLER:', req.query);
    const { title, performer } = req.query;

    const songs = await songRepositories.getSongByWithFilter({
      title,
      performer,
    });

    if (songs.length === 0) {
      return response(res, 200, null, { songs: [] });
    }

    return response(res, 200, null, { songs : songs });
  } catch (error) {
    next(error);
  }
};


export const updateSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, year, genre, performer, duration, albumId } = req.body ?? {};
    const songIsAny = await songRepositories.getSongById(id);

    if (!songIsAny) {
      return response(res, 404, 'Lagu tidak ditemukan');
    }

    const song = await songRepositories.updateSongById({ id, title, year, genre, performer, duration, albumId });

    if (!song) {
      throw new InvariantError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
    return response(res, 200, 'Lagu berhasil diperbarui', null);
  } catch (error) {
    next(error);
  }
};

export const deleteSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const songIsAny = await songRepositories.getSongById(id);

    if (!songIsAny) {
      return response(res, 404, 'Lagu tidak ditemukan');
    }

    await songRepositories.deleteSongById(id);
    return response(res, 200, 'Lagu berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};