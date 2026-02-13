import { Router } from 'express';
import {
  deleteNoteByIdHandler,
  editNoteByIdHandler,
  getNoteByIdHandler,
  addNoteHandler,
  getAllNotesHandler,
} from '../controller/note-controller.js';
import validate from '../../../middlewares/validate.js';
import { notePayloadSchema, noteUpdatePayloadSchema } from '../../../services/notes/validator/schema.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/notes', authenticateToken, validate(notePayloadSchema), addNoteHandler);
router.get('/notes', authenticateToken, getAllNotesHandler);
router.get('/notes/:id', authenticateToken, getNoteByIdHandler);
router.put('/notes/:id', authenticateToken, validate(noteUpdatePayloadSchema), editNoteByIdHandler);
router.delete('/notes/:id', authenticateToken, deleteNoteByIdHandler);

export default router;
