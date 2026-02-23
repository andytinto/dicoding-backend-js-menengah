import TokenManager from '../security/token-manager.js';
import response from '../utils/response.js';

async function authenticateToken(req, res, next) {
  const authHeader  = req.headers.authorization;

  if (!authHeader  || !authHeader .startsWith('Bearer ')) {
    return response(res, 401, 'Authentication diperlukan', null);
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const user = await TokenManager.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.auth  = user;

    return next();

  } catch (error) {
    return response(res, 401, error.message, null);
  }
};

export default authenticateToken;