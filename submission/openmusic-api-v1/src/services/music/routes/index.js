import {  Router } from 'express';

import { healthCheck } from '../controller/album-controller.js';

const routes = Router();

routes.use('/health', healthCheck);

export default routes;