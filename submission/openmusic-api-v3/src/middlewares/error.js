import response from '../utils/response.js';
import { ClientError } from '../exceptions/index.js';
import multer from 'multer';

const ErrorHandler = (err, req, res, next) => {
  // console.log(err.message);
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return response(res, 413, 'Ukuran filter terlalu besar', null);
  }

  if (err.message === 'FILE_TYPE_NOT_ALLOWED') {
    return res.status(400).json({
      status: 'fail',
      message: 'Tipe file tidak didukung'
    });
  }

  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }

  if (err.isJoi) {
    return response(res, 400, err.details[0].message, null);
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Errror';

  console.error('Unhandled error:', err);
  return response(res, status, message, null);
};

export default ErrorHandler;
