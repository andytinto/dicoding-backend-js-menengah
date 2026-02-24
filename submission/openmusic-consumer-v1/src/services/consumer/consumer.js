import 'dotenv/config';
import amqp from 'amqplib';
import PlaylistRepositories from '../playlist/repositories/playlist-repositories.js';
import MailSender from './mailsender.js';
import Listener from './listener.js';

const QUEUE = 'export:playlist';

const init = async () => {
  const mailSender = new MailSender();
  const listener = new Listener(PlaylistRepositories, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  // batasi concurrency
  channel.prefetch(1);

  channel.consume(
    QUEUE,
    (msg) => listener.listen(msg, channel),
    { noAck: false }
  );

  console.log('Worker listening:', QUEUE);
};

init();