import UserRepository from '../../users/repositories/user-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';

export const createUser = async (req, res, next) => {
  const { username, password, fullname } = req.body;

  const isUserNameExist = await UserRepository.verifyNewUserName(username);
  if (isUserNameExist) {
    return next(new InvariantError('Gagal menambahkan user. Username sudah digunakan.'));
  }
  const userId = await UserRepository.createUser({ username, password, fullname });
  if (!userId) {
    return next(new InvariantError('User gagal ditambahkan'));
  }

  return response(res, 201, 'User berhasil ditambahkan', { userId });
};