import PlaylistRepository from '../../playlist/repositories/playlist-repositories.js';
import SongsRepository from '../../playlist/repositories/songs-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';
import AuthorizationError from '../../../exceptions/authentication-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

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

export const getPlaylists = async (req, res, next) => {
  if (!req.auth) {
    throw new AuthorizationError('Authentication diperlukan');
  }

  const { id: owner } = req.auth;

  const playlists = await PlaylistRepository.getPlaylists(owner);

  return response(res, 200, null, { playlists });
};

export const deletePlaylist = async (req, res, next) => {
  const { id } = req.params;

  if (!req.auth) {
    throw new AuthorizationError('Authentication diperlukan');
  }

  const { id: owner } = req.auth;

  await PlaylistRepository.deletePlaylist(id, owner);

  return response(res, 200, 'Playlist berhasil dihapus');
};

export const addSongToPlaylist = async (req, res, next) => {
  const { id: playlistId } = req.params;
  const { songId } = req.body;

  if (!req.auth) {
    throw new AuthorizationError('Authentication diperlukan');
  }

  if (!songId) {
    return next(new NotFoundError('songId is required'));
  }

  const songIsAny = await SongsRepository.getSongById(songId);
  if (!songIsAny) {
    return new InvariantError('songId invalid');
  }

  const { id: owner } = req.auth;

  await PlaylistRepository.addSongToPlaylist(playlistId, songId, owner);

  return response(res, 201, 'Lagu berhasil ditambahkan ke playlist');
};

export const deleteSongFromPlaylist = async (req, res, next) => {
  const { id: playlistId } = req.params;
  const { songId } = req.body;

  if (!req.auth) {
    throw new AuthorizationError('Authentication diperlukan');
  }

  const { id: owner } = req.auth;

  await PlaylistRepository.deleteSongFromPlaylist(playlistId, songId, owner);

  return response(res, 200, 'Lagu berhasil dihapus dari playlist');
};