import express from 'express';
import multer from 'multer';
import { healthCheck, createAlbum, getAlbumByIdWithSongs, updateAlbumById, deleteAlbumById } from '../controller/album-controller.js';
import { createSongs, getSongByWithFilter, getSongById, updateSongById, deleteSongById } from '../controller/song-controller.js';
import validate from '../../../middlewares/validate.js';
import { createAlbumPayload, updateAlbumPayload, createSongsPayload, updateSongsPayload } from '../../../services/music/validator/schema.js';
import uploadCover from '../../../middlewares/upload-album-cover.js';
import { uploadAlbumCover } from '../controller/album-controller.js';

const router = express.Router();

router.get('/health', healthCheck);
router.post('/albums', validate(createAlbumPayload), createAlbum);
router.get('/albums/:id', getAlbumByIdWithSongs);
router.put('/albums/:id', validate(updateAlbumPayload), updateAlbumById);
router.delete('/albums/:id', deleteAlbumById);

router.post('/songs', validate(createSongsPayload), createSongs);
router.get('/songs', getSongByWithFilter);
router.get('/songs/:id', getSongById);
router.put('/songs/:id', validate(updateSongsPayload), updateSongById);
router.delete('/songs/:id', deleteSongById);

router.post(
  '/albums/:id/covers',
  (req, res, next) => {
    uploadCover.single('cover')(req, res, (err) => {
      if (err) {
        console.log(err);
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            status: 'fail',
            message: 'Ukuran file terlalu besar'
          });
        }

        if (err.message === 'FILE_TYPE_NOT_ALLOWED') {
          return res.status(400).json({
            status: 'fail',
            message: 'Tipe file tidak didukung'
          });
        }

        return res.status(400).json({
          status: 'fail',
          message: 'Sampul gagal diunggah'
        });
      }
      next();
    });
  },
  uploadAlbumCover
);

export default router;