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

      const playlist = await this._playlistRepositories.getPlaylistsById(playlistId);

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