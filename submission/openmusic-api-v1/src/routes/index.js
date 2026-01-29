import { healthCheck, createAlbum } from '../controller/album-controller.js';
import validate from '../../../middlewares/validate.js';
import { createAlbumPayload } from '../../../services/notes/validator/schema.js';

const router = express.Router();

router.get('/health', healthCheck);
router.post('/albums', validate(createAlbumPayload), createAlbum);

export default router;