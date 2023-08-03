const { PORT = 4000, SERVER_MONGO, NODE_ENV } = process.env;

const MONGODB = 'mongodb://127.0.0.1:27017/test';

module.exports = {
  PORT,
  SERVER_MONGO,
  NODE_ENV,
  MONGODB,
};
