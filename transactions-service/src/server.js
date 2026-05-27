const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@mongo:27017/banco_transacciones?authSource=admin';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('TransactionsService connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`TransactionsService running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});
