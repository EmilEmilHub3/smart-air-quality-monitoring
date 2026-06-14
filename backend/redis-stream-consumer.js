const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

const STREAM_NAME = 'measurement-stream';

let lastId = '$';

async function startConsumer() {
  console.log('Redis Stream Consumer started');
  console.log('Waiting for new measurements...\n');

  while (true) {
    try {
      const result = await redis.xread(
        'BLOCK',
        0,
        'STREAMS',
        STREAM_NAME,
        lastId,
      );

      if (!result) continue;

      const [, messages] = result[0];

      for (const [id, fields] of messages) {
        lastId = id;

        const data = {};

        for (let i = 0; i < fields.length; i += 2) {
          data[fields[i]] = fields[i + 1];
        }

        console.log('\nMeasurement received from Redis Stream');
        console.log(data);

        const radon = Number(data.radonShortTermAvg) || 0;

        if (radon >= 100) {
          console.log(`\nALERT: High Radon Detected! (${radon} Bq/m³)\n`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

startConsumer().catch(console.error);