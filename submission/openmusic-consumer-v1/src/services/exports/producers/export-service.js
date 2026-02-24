import amqp from 'amqplib';

const ExportService = {
  sendMessage: async (message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_KEY, { durable: true });
    await channel.sendToQueue(process.env.QUEUE_KEY, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default ExportService;