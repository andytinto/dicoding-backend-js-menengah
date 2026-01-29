import express from 'express';
import { healthCheck, createAlbum , getAlbumById, updateAlbumById, deleteAlbumById} from '../controller/album-controller.js';
import { createSongs } from '../controller/song-controller.js';
import validate from '../../../middlewares/validate.js';
import { createAlbumPayload, updateAlbumPayload, createSongsPayload } from '../../../services/music/validator/schema.js';

const router = express.Router();

router.get('/health', healthCheck);
router.post('/albums', validate(createAlbumPayload), createAlbum);
router.get('/albums/:id', getAlbumById);
router.put('/albums/:id', validate(updateAlbumPayload), updateAlbumById);
router.delete('/albums/:id', deleteAlbumById);

router.post('/songs', validate(createSongsPayload), createSongs);

export default router;