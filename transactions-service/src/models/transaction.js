const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  fromAccountId: String,
  toAccountId: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  description: String,
  timestamp: { type: Date, default: Date.now },
  reference: String
});

module.exports = mongoose.model('Transaction', transactionSchema);

