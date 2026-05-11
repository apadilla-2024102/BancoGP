// customers-accounts-service/src/models/account.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const accountSchema = {
  _id: 'ObjectId',
  accountNumber: 'String',
  customerId: 'ObjectId',
  accountType: 'String', // Savings, Checking, Investment, etc
  balance: 'Decimal',
  currency: { type: 'String', default: 'USD' },
  status: { type: 'String', enum: ['active', 'inactive', 'frozen'] },
  interestRate: 'Decimal',
  createdAt: 'Date',
  updatedAt: 'Date'
};

/*
// Implementación con Mongoose:

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
*/
