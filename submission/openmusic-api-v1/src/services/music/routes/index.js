import express from 'express';
import { healthCheck, createAlbum , getAlbumById} from '../controller/album-controller.js';
import validate from '../../../middlewares/validate.js';
import { createAlbumPayload } from '../../../services/music/validator/schema.js';

const router = express.Router();

router.get('/health', healthCheck);
router.post('/albums', validate(createAlbumPayload), createAlbum);
router.get('/albums/:id', getAlbumById);

export default router;