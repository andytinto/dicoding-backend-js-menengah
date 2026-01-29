import InvariantError from '../../../exceptions/invariant-error.js';
import albumRepositories from '../repositories/album-repositories.js';
import response from '../../../utils/response.js';

export const healthCheck = (req, res) => res.json({
  status: 'success',
  data: { message: 'OK' },
});

export const createAlbum = async (req, res, next) => {
  try {
    const { name, year } = req.body ?? {};

    const album = await albumRepositories.createAlbums({ name, year });

    if (!album) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return response(res, 201, null, {
      albumId: album.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await albumRepositories.getAlbumById(id);
    if (!album)
    {
      return response(res, 404, 'Album tidak ditemukan');
    }

    return response(res, 200, null, { album: {
      id: album.id,
      name: album.name,
      year: album.year,
     }});
  } catch (error) {
    next(error);
  }
};

export const getAlbumByIdWithSongs = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rows = await albumRepositories.getAlbumByIdWithSongs(id);

    if (!rows) {
      return response(res, 404, 'Album tidak ditemukan');
    }

    const album = {
      id: rows[0].album_id,
      name: rows[0].name,
      year: rows[0].year,
      songs: rows
        .filter(row => row.song_id !== null)
        .map(row => ({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        })),
    };

    return response(res, 200, null, { album });
  } catch (error) {
    next(error);
  }
};


export const updateAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, year } = req.body;
    const albumIsAny = await albumRepositories.getAlbumById(id);

    if (!albumIsAny) {
      return response(res, 404, 'Album tidak ditemukan');
    }

    const album = await albumRepositories.updateAlbumById({ id, name, year });
    return response(res, 200, 'Album berhasil diperbarui', null);
  } catch (error) {
    next(error);
  }
};

export const deleteAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const albumIsAny = await albumRepositories.getAlbumById(id);

    if (!albumIsAny) {
      return response(res, 404, 'Album tidak ditemukan');
    }

    await albumRepositories.deleteAlbumById(id);
    return response(res, 200, 'Album berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};