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

    return response(res, 201, 'Album berhasil ditambahkan', {
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

    return response(res, 200, 'Album berhasil ditemukan', { 
      id: album.id,
      name: album.name,
      year: album.year,
     });
  } catch (error) {
    next(error);
  }
};