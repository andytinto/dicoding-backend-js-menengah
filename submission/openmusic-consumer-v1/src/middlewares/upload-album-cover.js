import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/album-covers');
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('FILE_TYPE_NOT_ALLOWED'));
  }
};

const uploadCover = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 512000 // 512 KB
  }
});

export default uploadCover;