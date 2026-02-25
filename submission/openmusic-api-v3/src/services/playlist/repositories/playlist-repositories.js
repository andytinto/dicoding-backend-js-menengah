import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import NotFoundError from '../../../exceptions/not-found-error.js';
import ForbiddenError from '../../../exceptions/forbidden-error.js';

class PlaylistRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createPlaylist(name, owner) {
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
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    await this._pool.query(query);
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const query1 = {
      text: `
        SELECT playlists.owner
        FROM playlists
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const checkAuth = await this._pool.query(query1);

    if (!checkAuth.rowCount) {
      throw new NotFoundError(
        'Data tidak ditemukan'
      );
    }
    else if (checkAuth.rows[0].owner !== userId) {
      await this.verifyCollaborationAccess(playlistId, userId);
    }
  }

  async verifyDeletePlaylistAccess(playlistId, userId) {
    console.log(userId);
    const query1 = {
      text: `
        SELECT playlists.owner
        FROM playlists
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const checkAuth = await this._pool.query(query1);

    if (!checkAuth.rowCount) {
      throw new NotFoundError(
        'Data tidak ditemukan'
      );
    }
    else if (checkAuth.rows[0].owner !== userId) {
      throw new ForbiddenError(
        'Anda tidak berhak akses playlist ini'
      );
    }
  }

  async verifyCollaborationAccess(playlistId, userId) {
    const query = {
      text: `
        SELECT playlists.owner
        FROM playlists
        LEFT JOIN collaborations
          ON collaborations.playlist_id = playlists.id
        WHERE playlists.id = $1
          AND (playlists.owner = $2 OR collaborations.user_id = $2)
      `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new ForbiddenError(
        'Anda tidak berhak mengakses playlist ini'
      );
    }
  }

  async verifyPlaylistOwner(playlistId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  // async verifyAnyPlaylist(playlistId) {
  //   const query = {
  //     text: 'SELECT owner FROM playlists WHERE id = $1',
  //     values: [playlistId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new NotFoundError('Playlist tidak ditemukan');
  //   }

  //   return result.rows;
  // }

  async getPlaylistWithSongs(playlistId) {
    const query = {
      text: `
      SELECT
        playlists.id AS playlist_id,
        playlists.name,
        users.username,
        songs.id AS song_id,
        songs.title,
        songs.performer
      FROM playlists
      JOIN users ON users.id = playlists.owner
      LEFT JOIN playlist_songs
        ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs
        ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1
    `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows;
  }
}

export default new PlaylistRepositories();