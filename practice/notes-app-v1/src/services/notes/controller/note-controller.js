import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import response from '../../../utils/response.js';
import noteRepositories from '../repositories/note-repositories.js';

export const addNoteHandler = async (req, res, next) => {
  const { title, body, tags } = req.body;
  const { id: owner } = req.user;
  const note = await noteRepositories.createNote({ title, body, tags, owner });
  if (!note) {
    return next(new InvariantError('Catatan gagal ditambahkan'));
  }
  return response(res, 201, 'Catatan berhasil ditambahkan', { note });
};

export const getAllNotesHandler = async (req, res) => {
  const { id: owner } = req.user;
  const noteDatas = await noteRepositories.getNotes(owner);
  return response(res, 200, 'Catatan sukses ditampilkan', { notes: noteDatas });
};

export const getNoteByIdHandler = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const isOwner = await noteRepositories.verifyNoteAccess(id, owner);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const note = await noteRepositories.getNoteById(id);
  if (!note) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }

  return response(res, 200, 'Catatan sukses ditampilkan', { note });
};

export const editNoteByIdHandler = async (req, res, next) => {
  const { id } = req.params;
  const { title, body, tags } = req.validated;
  const { id: owner } = req.user;

  const isOwner = await noteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const note = await noteRepositories.editNote({ id, title, body, tags });
  if (!note) {
    return next(new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan'));
  }

  return response(res, 200, 'Catatan berhasil diperbarui', { note });
};

export const deleteNoteByIdHandler = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const isOwner = await noteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
  }

  const noteId = await noteRepositories.deleteNote(id);
  if (!noteId) {
    return next(new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan'));
  }
  return response(res, 200, 'Catatan berhasil dihapus');
};
