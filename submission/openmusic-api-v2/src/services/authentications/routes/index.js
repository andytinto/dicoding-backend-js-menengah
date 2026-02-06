import { Router } from 'express';
import { login, refreshToken } from '../controller/authentications-controller.js';
import validate from '../../../middlewares/validate.js';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema
} from '../validator/schema.js';

const router = Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);

export default router;