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

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async updateAlbumById({ id, name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id, name, year, created_at, updated_at',
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }

}

export default new AlbumRepositories();
