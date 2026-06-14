const amqp = require('amqplib');

async function start() {
  const rabbitUrl = 'amqp://localhost:5672';
  const exchangeName = 'smartair.measurements';

  const connection = await amqp.connect(rabbitUrl);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'fanout', {
    durable: true,
  });

  // Opretter en midlertidig queue til denne alert-client.
  const queue = await channel.assertQueue('', {
    exclusive: true,
  });

  // Binder queue til exchange, så den subscriber på measurement events.
  await channel.bindQueue(queue.queue, exchangeName, '');

  console.log('RabbitMQ alert consumer started');
  console.log('Waiting for measurement.created events...');

  channel.consume(queue.queue, (message) => {
    if (!message) return;

    const event = JSON.parse(message.content.toString());
    const measurement = event.data;

    console.log('\nNew measurement received from RabbitMQ:');
    console.log(measurement);

    if (measurement.radonShortTermAvg >= 100) {
      console.log('ALERT: High radon level detected!');
    }

    channel.ack(message);
  });
}

start().catch(console.error);