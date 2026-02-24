// import amqp from 'amqplib';

// const ExportService = {
//   sendMessage: async (message) => {
//     const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
//     const channel = await connection.createChannel();

//     await channel.assertQueue(process.env.QUEUE_KEY, { durable: true });
//     await channel.sendToQueue(process.env.QUEUE_KEY, Buffer.from(message));

//     setTimeout(() => {
//       connection.close();
//     }, 1000);
//   },
// };

// export default ExportService;

import amqp from 'amqplib';

const ExportService = {
  sendMessage: async (queue, payload) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );

    setTimeout(() => connection.close(), 500);
  },
};

export default ExportService;