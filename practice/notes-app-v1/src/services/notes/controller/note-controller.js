import { nanoid } from 'nanoid';
// import notes from '../notes.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';
import noteRepositories from '../repositories/note-repositories.js';

// export const addNoteHandler = (req, res, next) => {
//   const { title = 'untitled', tags, body } = req.body;

//   const id = nanoid(16);
//   const createdAt = new Date().toISOString();
//   const updatedAt = createdAt;

//   const newNote = {
//     id,
//     title,
//     tags,
//     body,
//     createdAt,
//     updatedAt,
//   };

//   notes.push(newNote);

//   const isSuccess = notes.filter((note) => note.id === id).length > 0;

//   if (!isSuccess) {
//     return next(new InvariantError('Catatan gagal ditambahkan'));
//   }

//   return response(res, 201, 'Catatan berhasil ditambahkan', { noteId: id });
// };

// export const getAllNotesHandler = (req, res) => res.json({
//   status: 'success',
//   data: { notes },
// });

// export const getNoteByIdHandler = (req, res, next) => {
//   const { id } = req.params;
//   const note = notes.find((n) => n.id === id);

//   if (!note) {
//     return next(new NotFoundError('Catatan tidak ditemukan'));
//   }

//   return response(res, 200, 'Catatan sukses ditampilkan', { note });
// };

// export const editNoteByIdHandler = (req, res, next) => {
//   const { id } = req.params;
//   const { title, tags, body } = req.body;
//   const updatedAt = new Date().toISOString();

//   const index = notes.findIndex((note) => note.id === id);
//   if (index === -1) {
//     return next(new NotFoundError('Catatan tidak ditemukan'));
//   }

//   notes[index] = {
//     ...notes[index],
//     title,
//     tags,
//     body,
//     updatedAt,
//   };

//   return response(res, 200, 'Catatan berhasil diperbarui', { note: notes[index] });
// };

// export const deleteNoteByIdHandler = (req, res, next) => {
//   const { id } = req.params;

//   const index = notes.findIndex((note) => note.id === id);
//   if (index === -1) {
//     return next(new NotFoundError('Catatan tidak ditemukan'));
//   }

//   notes.splice(index, 1);

//   return response(res, 200, 'Catatan berhasil dihapus');
// };

export const addNoteHandler = async (req, res, next) => {
  const { title, body, tags } = req.body;
  const note = await noteRepositories.createNote({ title, body, tags });
  if (!note) {
    return next(new InvariantError('Catatan gagal ditambahkan'));
  }
  return response(res, 201, 'Catatan berhasil ditambahkan', { note });
};

export const getAllNotesHandler = async (req, res) => {
  const noteDatas = await noteRepositories.getNotes();
  return response(res, 200, 'Catatan sukses ditampilkan', { notes: noteDatas });
};

export const getNoteByIdHandler = async (req, res, next) => {
  const { id } = req.params;
  const note = await noteRepositories.getNoteById(id);
  if (!note) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }
  return response(res, 200, 'Catatan sukses ditampilkan', { note });
};

export const editNoteByIdHandler = async (req, res, next) => {
  const { id } = req.params;
  const { title, body, tags } = req.body;
  const note = await noteRepositories.editNote({ id, title, body, tags });
  if (!note) {
    return next(new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan'));
  }
  return response(res, 200, 'Catatan berhasil diperbarui', { note });
};

export const deleteNoteByIdHandler = async (req, res, next) => {
  const { id } = req.params;
  const noteId = await noteRepositories.deleteNote(id);
  if (!noteId) {
    return next(new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan'));
  }
  return response(res, 200, 'Catatan berhasil dihapus');
};
