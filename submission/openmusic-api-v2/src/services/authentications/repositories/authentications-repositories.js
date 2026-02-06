import { Pool } from 'pg';

class AuthenticationRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }
}

export default new AuthenticationRepositories();