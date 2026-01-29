import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class AlbumRepositories {
  constructor() {
    this._pool = new Pool();
  }

   async createAlbums({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums(id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id, name, year, created_at, updated_at',
      values: [id, name, year, createdAt, updatedAt],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

export default new AlbumRepositories();