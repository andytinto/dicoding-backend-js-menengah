const response = (res, statusCode, message, data) => res.status(statusCode).json({
  code: statusCode,
  status: statusCode < 400 ? 'success' : 'fail',
  message,
  data,
}).end();

export default response;
