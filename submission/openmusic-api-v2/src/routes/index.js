import { Router } from 'express';
import songs from '../services/music/routes/index.js';
import users from '../services/users/routes/index.js';

const router = Router();

router.use('/', songs);
router.use('/', users);

export default router;