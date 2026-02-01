// import { Router } from 'express';
// import {
//   addNote, getAllNotes, getNoteById, editNoteById, deleteNoteById,
// } from '../controllers/note-controller.js';
// import validate from '../../../middlewares/validate.js';
// import { notePayloadSchema, noteUpdatePayloadSchema } from '../../../services/notes/validator/schema.js';

// const router = express.Router();

// router.post('/notes', validate(notePayloadSchema), addNote);
// router.get('/notes', getAllNotes);
// router.get('/notes/:id', getNoteById);
// router.put('/notes/:id', validate(noteUpdatePayloadSchema), editNoteById);
// router.delete('/notes/:id', deleteNoteById);

// export default router;

import { Router } from 'express';
import notes from '../services/notes/routes/index.js';
import users from '../services/users/routes/index.js';

const router = Router();

router.use('/', notes);
router.use('/', users);

export default router;