'use strict';

const argv = require('optimist').argv;
const Redis = require('ioredis');

const host = argv.host;
const port = argv.port;
const command = argv.command;
const key = argv.key;
const field = argv.field;
const value = argv.value;
const ttl = argv.ttl;

const config = [
  {
    host: host,
    port: port || 6379,
  },
];
const redisClient = new Redis.Cluster(config);

(async () => {
  console.log(`[${new Date().toLocaleString()}]Start script.`);

  let result;
  switch (command) {
    case 'del':
      result = await redisClient.del(key);
      break;
    case 'exists':
      result = await redisClient.exists(key);
      break;
    case 'expire':
      result = await redisClient.expire(key, ttl);
      break;
    case 'get':
      result = await redisClient.get(key);
      break;
    case 'hdel':
      result = await redisClient.hdel(key);
      break;
    case 'hexists':
      result = await redisClient.hexists(key, field);
      break;
    case 'hget':
      result = await redisClient.hget(key);
      break;
    case 'hset':
      result = await redisClient.hset(key, field, value);
      break;
    case 'set':
      result = await redisClient.set(key, value);
      break;
    case 'keys':
      if (key === '*') {
        result = 'I cant believe it';
        break;
      }
      result = await redisClient.keys(key);
      break;

    default:
      result = await redisClient.ping();
      break;
  }

  console.log(result);

  await redisClient.quit();

  console.log(`[${new Date().toLocaleString()}]End script.`);
})().catch(async (err) => {
  console.error(err);
  await redisClient.quit();
  process.exit(1);
});
