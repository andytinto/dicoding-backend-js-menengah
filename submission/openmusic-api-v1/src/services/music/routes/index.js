import express from 'express';
import validate from '../../../middlewares/validate.js';
import { createAlbum, healthCheck } from '../controller/album-controller.js';
import { createAlbumPayload } from '../../../services/music/validator/schema.js';

const routes = express.Router();

routes.get('/health', healthCheck);
routes.post('/albums', validate(createAlbumPayload), createAlbum);

export default routes;