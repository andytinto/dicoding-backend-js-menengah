import { Router } from 'express';
import songs from '../services/music/routes/index.js';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';
import playlist from '../services/playlist/routes/index.js';

const router = Router();

router.use('/', songs);
router.use('/', users);
router.use('/', authentications);
router.use('/', playlist);

export default router;