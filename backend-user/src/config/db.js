const mongoose = require('mongoose');
const { createClient } = require('redis');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const connectRedis = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  console.log('Redis Connected');
  return client;
};

module.exports = { connectDB, connectRedis };
