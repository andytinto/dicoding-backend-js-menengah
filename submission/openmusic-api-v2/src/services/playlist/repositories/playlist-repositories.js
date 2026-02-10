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

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id 
      WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async addSongToPlaylist(playlistId, songId) {
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2) RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
}

export default new PlaylistRepositories();