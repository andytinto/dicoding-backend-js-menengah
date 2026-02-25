class Listener {
  constructor(playlistRepositories, mailSender) {
    this._playlistRepositories = playlistRepositories;
    this._mailSender = mailSender;
  }

  async listen(message, channel) {
    if (!message) return;

    const raw = message.content.toString();
    console.log('RAW MESSAGE:', raw);

    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      if (!playlistId || !targetEmail) {
        throw new Error('Invalid payload');
      }

      const rows = await this._playlistRepositories.getPlaylistsById(playlistId);

      const playlist = {
        id: rows[0].playlist_id,
        name: rows[0].playlist_name,
        songs: rows
          .filter(row => row.song_id !== null)
          .map(row => ({
            id: row.song_id,
            title: row.song_title,
            performer: row.song_performer,
          })),
      };

      console.log('PLAYLIST:', playlist);

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist, null, 2)
      );

      console.log('Mail sent result:', result);

      // ack hanya setelah sukses
      channel.ack(message);
    } catch (error) {
      console.error('Export failed:', error);

      // drop message to DLQ
      channel.nack(message, false, false);
    }
  }
}

export default Listener;