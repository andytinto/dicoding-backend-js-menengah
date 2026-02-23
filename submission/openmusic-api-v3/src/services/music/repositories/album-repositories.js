import { Pool } from 'pg';
import { nanoid } from 'nanoid';
class AlbumRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createAlbums({ name, year }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id, name, year',
      values: [id, name, year],
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

  async getAlbumByIdWithSongs(id) {
    const query = {
      text: `
      SELECT 
        a.id AS album_id,
        a.name,
        a.year,
        s.id AS song_id,
        s.title,
        s.performer
      FROM albums a
      LEFT JOIN songs s ON s.album_id = a.id
      WHERE a.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows;
  }

  async updateAlbumById({ id, name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id, name, year',
      values: [name, year, id],
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
