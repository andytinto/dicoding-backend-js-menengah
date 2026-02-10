import express from 'express';
import { createUser } from '../controller/users-controller.js';
import validate from '../../../middlewares/validate.js';
import { userPayloadSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/users', validate(userPayloadSchema), createUser);

export default router;