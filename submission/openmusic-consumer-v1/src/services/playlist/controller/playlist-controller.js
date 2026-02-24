import PlaylistRepository from '../repositories/playlist-repositories.js';
import SongsRepository from '../repositories/songs-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';
import AuthorizationError from '../../../exceptions/authentication-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import playlistActivitiesRepository from '../repositories/playlist-activities-repository.js';
import CollaborationRepository from '../repositories/collaboration-repository.js';
import UserRepository from '../../users/repositories/user-repositories.js';
import ForbiddenError from '../../../exceptions/forbidden-error.js';

export const createPlaylist = async (req, res, next) => {
  const { name } = req.body;

  if (!req.auth) {
    throw new AuthorizationError('Authentication diperlukan');
  }

  const { id: owner } = req.auth;

  const playlistId = await PlaylistRepository.createPlaylist(name, owner);
  if (!playlistId) {
    return next(new InvariantError('Playlist gagal ditambahkan'));
  }

  return response(res, 201, 'Playlist berhasil ditambahkan', { playlistId });
};

export const getPlaylists = async (req, res, next) => {
  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: owner } = req.auth;

  const playlists = await PlaylistRepository.getPlaylists(owner);

  return response(res, 200, null, { playlists });
};

export const deletePlaylist = async (req, res, next) => {
  const { id: playlistId, songId : songId } = req.params;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: userId } = req.auth;

  await PlaylistRepository.verifyDeletePlaylistAccess(
    playlistId,
    userId,
  );

  await PlaylistRepository.deletePlaylistById(playlistId, songId);

  return response(res, 200, 'Playlist berhasil dihapus');
};

export const deleteSongPlaylist = async (req, res, next) => {
  const { id: playlistId } = req.params;
  const { songId } = req.body;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: userId } = req.auth;

  await PlaylistRepository.verifyPlaylistAccess(
    playlistId,
    userId,
  );

  await PlaylistRepository.deleteSongFromPlaylist(playlistId, songId);

  await playlistActivitiesRepository.addActivity({
    playlistId: playlistId,
    songId: songId,
    userId: userId,
    action: 'delete',
  });

  return response(res, 200, 'Song di playlist berhasil dihapus');
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
    throw new NotFoundError('songId invalid');
  }

  const { id: owner } = req.auth;

  await PlaylistRepository.verifyPlaylistAccess(
    playlistId,
    owner,
  );

  await PlaylistRepository.addSongToPlaylist(playlistId, songId);

  await playlistActivitiesRepository.addActivity({
    playlistId: playlistId,
    songId: songId,
    userId: owner,
    action: 'add',
  });

  return response(res, 201, 'Lagu berhasil ditambahkan ke playlist');
};

export const deleteSongFromPlaylist = async (req, res, next) => {
  const { id: playlistId } = req.params;
  const { songId } = req.body;
  const { id: userId } = req.auth;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  await PlaylistRepository.verifyPlaylistAccess(
    playlistId,
    userId
  );

  await PlaylistRepository.deleteSongFromPlaylist(playlistId, songId);

  await playlistActivitiesRepository.addActivity({
    playlistId,
    songId,
    userId,
    action: 'delete',
  });

  return response(res, 200, 'Lagu berhasil dihapus dari playlist');
};

export const getPlaylistActivities = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;

    if (!req.auth) {
      throw new AuthorizationError('Authentication diperlukan');
    }

    const { id: userId } = req.auth;

    await PlaylistRepository.verifyPlaylistAccess(
      playlistId,
      userId
    );

    const activities =
      await playlistActivitiesRepository.getActivities(
        playlistId
      );

    return response(res, 200, 'success', {
      playlistId,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

export const createCollaboration = async (req, res, next) => {
  const { playlistId, userId } = req.body;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: owner } = req.auth;

  const playlistData =
    await PlaylistRepository.verifyPlaylistOwner(playlistId);

  if (!playlistData) {
    throw new NotFoundError('Playlist tidak ditemukan');
  }

  if (playlistData.owner !== owner) {
    throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
  }

  const verifyUser = await UserRepository.getUserById(userId);
  if (!verifyUser) {
    throw new NotFoundError('User tidak ditemukan');
  }

  const collaborationId = await CollaborationRepository.addCollaboration(playlistId, userId);

  return response(res, 201, 'Collaboration berhasil ditambahkan', { collaborationId });
};

export const deleteCollaboration = async (req, res, next) => {
  const { playlistId, userId } = req.body;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: owner } = req.auth;

  const playlistData =
    await PlaylistRepository.verifyPlaylistOwner(playlistId);

  if (!playlistData) {
    throw new NotFoundError('Playlist tidak ditemukan');
  }

  if (playlistData.owner !== owner) {
    throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
  }

  await CollaborationRepository.deleteCollaboration(playlistId, userId);

  return response(res, 200, 'Collaboration berhasil dihapus');
};

export const getPlaylistSongsById = async (req, res, next) => {
  try {
    const { id: playlistId } = req.params;

    if (!req.auth) {
      throw new AuthorizationError('Authentication diperlukan');
    }

    const { id: userId } = req.auth;

    await PlaylistRepository.verifyPlaylistAccess(
      playlistId,
      userId
    );

    const rows =
      await PlaylistRepository.getPlaylistWithSongs(
        playlistId
      );

    if (!rows || rows.length === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = {
      id: rows[0].playlist_id,
      name: rows[0].name,
      username: rows[0].username,
      songs: rows
        .filter(row => row.song_id !== null)
        .map(row => ({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        })),
    };

    return response(res, 200, 'success', { playlist });
  } catch (error) {
    next(error);
  }
};