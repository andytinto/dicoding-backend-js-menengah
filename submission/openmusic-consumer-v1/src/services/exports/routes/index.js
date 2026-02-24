import { Router } from 'express';
import { exportPlaylist } from '../controllers/export-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { exportPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/export/playlists/:id', authenticateToken, validate(exportPayloadSchema),  exportPlaylist);

export default router;