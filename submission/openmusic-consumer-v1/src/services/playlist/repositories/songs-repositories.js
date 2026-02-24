import { Pool } from 'pg';

class SongRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

export default new SongRepositories();