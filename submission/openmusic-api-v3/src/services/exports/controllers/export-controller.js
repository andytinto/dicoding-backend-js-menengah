import response from '../../../utils/response.js';
import ExportService from '../producers/export-service.js';
import PlaylistRepository from '../../playlist/repositories/playlist-repositories.js';
import AuthorizationError from '../../../exceptions/authentication-error.js';

export const exportPlaylist = async (req, res, next) => {
  const { targetEmail } = req.validated;
  const { id: playlistId } = req.params;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: userId } = req.auth;

  await PlaylistRepository.verifyDeletePlaylistAccess(playlistId, userId);
  const message = {
    targetEmail,
    playlistId,
  };

  await ExportService.sendMessage(process.env.QUEUE_KEY, JSON.stringify(message));
  return response(res, 201, 'Permintaan Anda sedang kami proses');
};
