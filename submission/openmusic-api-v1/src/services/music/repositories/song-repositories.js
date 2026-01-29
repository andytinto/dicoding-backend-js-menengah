import { Pool } from 'pg';
import { nanoid } from 'nanoid';
class SongRepositories {
  constructor() {
    this._pool = new Pool();
  }

   async createSongs({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO songs(id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, title, year, genre, performer, duration, album_id, created_at, updated_at',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

export default new SongRepositories();
