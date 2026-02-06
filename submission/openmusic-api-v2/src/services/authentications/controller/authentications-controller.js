import AuthenticationRepositories from '../repositories/authentications-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

export const login = async (req, res, next) => {
  const { username, password } = req.validated;
  const userId = await UserRepositories.verifyUserCredential(username, password);

  if (!userId) {
    return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
  }

  const accessToken = TokenManager.generateAccessToken({ id: userId });
  const refreshToken = TokenManager.generateRefreshToken({ id: userId });

  await AuthenticationRepositories.addRefreshToken(refreshToken);

  return response(res, 201, 'Authentication berhasil ditambahkan', {
    accessToken,
    refreshToken,
  });
};
