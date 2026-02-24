import { Pool } from 'pg';
import { nanoid } from 'nanoid';
class SongRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createSongs({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO songs(id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, year, genre, performer, duration, album_id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getSongs() {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, genre, performer, duration, album_id FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getSongByWithFilter({ title, performer }) {
    const query = {
      text: `
      SELECT id, title, performer
      FROM songs
      WHERE 1=1`,
      values: [],
    };

    if (title) {
      query.values.push(`%${title}%`);
      query.text += ` AND LOWER(title) LIKE LOWER($${query.values.length})`;
    }

    if (performer) {
      query.values.push(`%${performer}%`);
      query.text += ` AND LOWER(performer) LIKE LOWER($${query.values.length})`;
    }

    const result = await this._pool.query(query);
    return result.rows;
  }


  async updateSongById({ id, title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id, title, year, genre, performer, duration, album_id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }
}

export default new SongRepositories();
