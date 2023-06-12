
import * as dotenv from 'dotenv'
dotenv.config();

import mongoose from 'mongoose';

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  keepAlive: true,
  keepAliveInitialDelay: 300000
};

if(!process.env.MONGO_URL){
  console.error('----- ERROR: MONGO_URL environment variable is required ------')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, connectOptions)
  .catch((error) => {
    console.error('----- ERROR: Failed to connect database on server startup ------')
    tryReconnect()
  });

async function tryReconnect() {
  let intervalId;
  intervalId = setInterval(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, connectOptions);
      clearInterval(intervalId);
    } catch (error) {
      console.log('----- ERROR: Failed to reconnect database ------')
    }
  }, connectOptions.serverSelectionTimeoutMS + 100);
}

mongoose.connection.on('error', (error) => { console.error('Mongoose: "error":\n', error); });
mongoose.connection.on('connecting', () => { console.log('Mongoose: "connecting"...')})
mongoose.connection.on('connected', () => { console.log('Mongoose: "connected"') });
mongoose.connection.on('disconnected', () => {console.log('Mongoose: "disconnected"')});