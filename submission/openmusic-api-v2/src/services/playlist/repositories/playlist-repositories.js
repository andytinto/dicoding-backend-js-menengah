import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class PlaylistRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createPlaylist({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
}

export default new PlaylistRepositories();