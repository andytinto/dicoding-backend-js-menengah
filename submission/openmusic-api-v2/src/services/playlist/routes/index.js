import express from 'express';
import {
  createPlaylist,
  getPlaylists,
  deletePlaylist,
  addSongToPlaylist,
  deleteSongFromPlaylist,
  getPlaylistActivities,
  createCollaboration,
  deleteCollaboration,
  getPlaylistSongsById,
} from '../controller/playlist-controller.js';
import validate from '../../../middlewares/validate.js';
import { playlistPayloadSchema, addSongToPlaylistPayloadSchema, getPlaylistActivitiesPayloadSchema, deletePlaylistPayloadSchema } from '../validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/playlists', authenticateToken, validate(playlistPayloadSchema), createPlaylist);
router.get('/playlists', authenticateToken, getPlaylists);
router.delete('/playlists/:id/songs', authenticateToken, validate(deletePlaylistPayloadSchema), deleteSongFromPlaylist);
router.delete('/playlists/:id', authenticateToken, deletePlaylist);
router.post('/playlists/:id/songs', authenticateToken, validate(addSongToPlaylistPayloadSchema), addSongToPlaylist);
router.get('/playlists/:id/activities', authenticateToken, validate(getPlaylistActivitiesPayloadSchema, 'params'), getPlaylistActivities);
router.post('/collaborations', authenticateToken, createCollaboration);
router.delete('/collaborations', authenticateToken, deleteCollaboration);
router.get('/playlists/:id/songs', authenticateToken, getPlaylistSongsById);

export default router;