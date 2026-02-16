import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();
const host = 'localhost';
const port = 5000;


// konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // folder tujuan
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// inilah yang sebelumnya hilang
const upload = multer({
  storage,
  limits: { fileSize: 500000 } // 500 KB
});

app.post('/uploads', (req, res) => {
  upload.single('data')(req, res, (err) => {
  
    if (err) {
      console.error(err);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        // Error karena file terlalu besar
        return res.status(413).json({ message: 'Berkas terlalu besar' });
      }
      
      // Error lainnya saat proses upload
      return res.status(400).json({ message: 'Berkas gagal diproses' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Berkas gagal diproses' });
    }

    console.log(req.file);
    return res.json({ message: `Berkas ${req.file.originalname} berhasil diproses!` });
  });

});

app.listen(port, () => {
  console.log(`Server start at http://${host}:${port}`);
});