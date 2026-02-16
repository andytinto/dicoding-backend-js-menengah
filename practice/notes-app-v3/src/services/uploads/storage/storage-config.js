import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ClientError from '../../../exceptions/client-error.js';

export const UPLOAD_FOLDER = path.resolve(process.cwd(), 'src/services/uploads/files/images');

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_FOLDER),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const mimeOk = file.mimetype === 'image/png';
  const extOk = path.extname(file.originalname).toLowerCase() === '.png';

  if (mimeOk && extOk) return cb(null, true);

  return cb(new ClientError('Only PNG files are allowed', 400), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

export default { UPLOAD_FOLDER, storage, upload };