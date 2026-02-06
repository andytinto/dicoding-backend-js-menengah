import express from 'express';
import { createUser } from '../controller/users-controller.js';

const router = express.Router();

router.post('/users', createUser);

export default router;