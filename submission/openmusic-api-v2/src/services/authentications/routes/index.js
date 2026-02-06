import { Router } from 'express';
import { login } from '../controller/authentications-controller.js';
import validate from '../../../middlewares/validate.js';
import {
  postAuthenticationPayloadSchema
} from '../validator/schema.js';

const router = Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);

export default router;