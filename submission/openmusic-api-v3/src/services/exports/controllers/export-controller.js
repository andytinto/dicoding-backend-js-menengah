import response from '../../../utils/response.js';
import ExportService from '../producers/export-service.js';
import PlaylistRepository from '../../playlist/repositories/playlist-repositories.js';
import AuthorizationError from '../../../exceptions/authentication-error.js';

export const exportPlaylist = async (req, res, next) => {
//   console.log('user:', req.user);
//   console.log('params:', req.params);
//   console.log('validated:', req.validated);

  const { targetEmail } = req.validated;
  const { id: playlistId } = req.params;

  if (!req.auth) {
    return next(new AuthorizationError('Authentication diperlukan'));
  }

  const { id: userId } = req.auth;

  await PlaylistRepository.verifyDeletePlaylistAccess(playlistId, userId);
  const message = {
    userId,
    targetEmail,
    id: playlistId,
  };

  await ExportService.sendMessage('export:notes', JSON.stringify(message));
  return response(res, 201, 'Permintaan export catatan dalam antrean');
};
