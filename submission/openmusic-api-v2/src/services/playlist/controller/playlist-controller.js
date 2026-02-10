import PlaylistRepository from '../../playlist/repositories/playlist-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';
import AuthorizationError from '../../../exceptions/authentication-error.js';

export const createPlaylist = async (req, res, next) => {
  const { name } = req.body;

  if (!req.auth) {
    throw new AuthorizationError('Authentication diperlukan');
  }

  const { id: owner } = req.auth;

  const playlistId = await PlaylistRepository.createPlaylist({ name, owner });
  if (!playlistId) {
    return next(new InvariantError('Playlist gagal ditambahkan'));
  }

  return response(res, 201, 'Playlist berhasil ditambahkan', { playlistId });
};
