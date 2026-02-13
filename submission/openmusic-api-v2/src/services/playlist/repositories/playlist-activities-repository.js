import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class PlaylistActivitiesRepository {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = nanoid(16);

    const query = {
      text: `
        INSERT INTO playlist_song_activities
        VALUES ($1, $2, $3, $4, $5, NOW())
      `,
      values: [id, playlistId, songId, userId, action],
    };

    await this._pool.query(query);
  }

  async getActivities(playlistId) {
    const query = {
      text: `
        SELECT users.username, songs.title, psa.action, psa.time
        FROM playlist_song_activities psa
        JOIN users ON users.id = psa.user_id
        JOIN songs ON songs.id = psa.song_id
        WHERE psa.playlist_id = $1
        ORDER BY psa.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default new PlaylistActivitiesRepository();
