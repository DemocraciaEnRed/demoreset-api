import mongoose from 'mongoose';

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  keepAlive: true,
  keepAliveInitialDelay: 300000
};

mongoose.connect("mongodb://localhost:27017/demoreset", connectOptions)
  .catch((error) => {
    console.error('----- ERROR: Failed to connect database on server startup ------')
    tryReconnect()
  });

async function tryReconnect() {
  let intervalId;
  intervalId = setInterval(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/demoreset', connectOptions);
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