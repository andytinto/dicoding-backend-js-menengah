const response = (res, statusCode, message, data) => {
  const result = {
    status: statusCode < 400 ? 'success' : 'failed',
  };

  if (message) {
    result.message = message;
  }

  if (data !== undefined && data !== null) {
    result.data = data;
  }

  return res.status(statusCode).json(result);
};

export default response;
