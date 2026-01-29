import express from 'express';
import { healthCheck, createAlbum , getAlbumByIdWithSongs, updateAlbumById, deleteAlbumById} from '../controller/album-controller.js';
import { createSongs, getSongs, getSongById, updateSongById, deleteSongById } from '../controller/song-controller.js';
import validate from '../../../middlewares/validate.js';
import { createAlbumPayload, updateAlbumPayload, createSongsPayload, updateSongsPayload } from '../../../services/music/validator/schema.js';

const router = express.Router();

router.get('/health', healthCheck);
router.post('/albums', validate(createAlbumPayload), createAlbum);
router.get('/albums/:id', getAlbumByIdWithSongs);
router.put('/albums/:id', validate(updateAlbumPayload), updateAlbumById);
router.delete('/albums/:id', deleteAlbumById);

router.post('/songs', validate(createSongsPayload), createSongs);
router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);
router.put('/songs/:id', validate(updateSongsPayload), updateSongById);
router.delete('/songs/:id', deleteSongById);

export default router;