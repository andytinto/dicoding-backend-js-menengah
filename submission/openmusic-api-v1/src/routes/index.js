import { Reouter } from 'express';
import { healthCheck } from '../controller/album-controller.js';

const router = Reouter();

router.get('/health', healthCheck);

export default router;