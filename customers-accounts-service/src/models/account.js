const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  accountType: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['active', 'inactive', 'frozen'],
    default: 'active'
  },
  interestRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);
