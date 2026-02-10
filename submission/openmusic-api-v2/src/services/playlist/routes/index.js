import express from 'express';
import { createPlaylist, getPlaylists, deletePlaylist, addSongToPlaylist } from '../controller/playlist-controller.js';
import validate from '../../../middlewares/validate.js';
import { playlistPayloadSchema, addSongToPlaylistPayloadSchema } from '../validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/playlists', authenticateToken, validate(playlistPayloadSchema), createPlaylist);
router.get('/playlists', authenticateToken, getPlaylists);
router.delete('/playlists/:id', authenticateToken, deletePlaylist);
router.post('/playlists/:id/songs', authenticateToken, validate(addSongToPlaylistPayloadSchema), addSongToPlaylist);

export default router;