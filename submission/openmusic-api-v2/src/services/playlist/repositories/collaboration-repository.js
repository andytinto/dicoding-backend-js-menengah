import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../../exceptions/invariant-error.js';

class CollaborationsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = nanoid(16);

    const query = {
      text: `
          INSERT INTO collaborations
          VALUES ($1, $2, $3)
          RETURNING id
        `,
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `
        DELETE FROM collaborations
        WHERE playlist_id = $1 AND user_id = $2
      `,
      values: [playlistId, userId],
    };

    await this._pool.query(query);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `
        SELECT id FROM collaborations
        WHERE playlist_id = $1 AND user_id = $2
      `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(
        'Kolaborator tidak ditemukan'
      );
    }
  }
}

export default new CollaborationsRepository();
