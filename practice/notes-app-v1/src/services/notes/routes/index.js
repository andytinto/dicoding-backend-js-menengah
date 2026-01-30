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

const router = Router();

router.post('/notes', validate(notePayloadSchema), addNoteHandler);
router.get('/notes', getAllNotesHandler);
router.get('/notes/:id', getNoteByIdHandler);
router.put('/notes/:id', validate(noteUpdatePayloadSchema), editNoteByIdHandler);
router.delete('/notes/:id', deleteNoteByIdHandler);

export default router;
