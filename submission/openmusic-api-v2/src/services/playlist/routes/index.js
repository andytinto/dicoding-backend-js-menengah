import express from 'express';
import { createPlaylist } from '../controller/playlist-controller.js';
import validate from '../../../middlewares/validate.js';
import { playlistPayloadSchema } from '../validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/playlists', authenticateToken, validate(playlistPayloadSchema), createPlaylist);

export default router;