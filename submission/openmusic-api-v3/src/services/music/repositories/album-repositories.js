import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import NotFoundError from '../../../exceptions/not-found-error.js';
import ClientError from '../../../exceptions/client-error.js';
import CacheService from '../../cache/redis-service.js';

class AlbumRepositories {
  constructor() {
    this._pool = new Pool();
    this.cacheService = new CacheService();
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
        a.cover,
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

  async updateAlbumCover(id, coverUrl) {
    const query = {
      text: `
        UPDATE albums
        SET cover = $1
        WHERE id = $2
        RETURNING id
      `,
      values: [coverUrl, id],
    };

    await this._pool.query(query);
  };

  async verifyAlbum(albumId) {
    const query1 = {
      text: `
        SELECT albums.id
        FROM albums
        WHERE albums.id = $1
      `,
      values: [albumId],
    };

    const checkAuth = await this._pool.query(query1);

    if (!checkAuth.rowCount) {
      throw new NotFoundError(
        'Data tidak ditemukan'
      );
    }
  }

  async verifyAlbumLikes(albumId, userId){
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 and user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new ClientError(
        'Anda sudah like album ini'
      );
    }
  }

  async CreateLikeAlbum(albumId, userId){
    await this.verifyAlbum(albumId);
    await this.verifyAlbumLikes(albumId, userId);

    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES($1, $2, $3) RETURNING id, user_id, album_id',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  };

  async GetLikeAlbum(albumId){
    const cacheKey = `likes-album:${albumId}`;

    await this.verifyAlbum(albumId);

    try {
      const albumLikes = await this.cacheService.get(cacheKey);
      // return JSON.parse(albumLikes);
      return {
        likes: JSON.parse(albumLikes),
        isFromCache: true,
      };

    } catch {
      return await this.SetAlbumLikesToRedis(albumId, cacheKey);
    }
  };

  async SetAlbumLikesToRedis(albumId, cacheKey) {
    const query = {
      text: `
        SELECT count(1) as likes
        FROM user_album_likes a
        WHERE a.album_id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);
    // console.log(result);

    // Save to cache
    await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0].likes));

    return {
      likes: Number(result.rows[0].likes),
      isFromCache: false,
    };
  }

  async DeleteLikeAlbum(albumId, userId){
    const cacheKey = `likes-album:${albumId}`;

    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 and user_id = $2',
      values: [albumId, userId],
    };

    await this.verifyAlbum(albumId);

    const albumLikes = await this.cacheService.get(cacheKey);
    if (albumLikes) {
      console.log(albumLikes);
      await this.cacheService.delete(cacheKey);
    }

    await this._pool.query(query);
  };

}

export default new AlbumRepositories();
