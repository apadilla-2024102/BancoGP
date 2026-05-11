// financial-products-service/src/models/interestRate.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const interestRateSchema = {
  _id: 'ObjectId',
  accountTypeId: 'ObjectId',
  rate: 'Decimal',
  effectiveFrom: 'Date',
  effectiveTo: 'Date',
  isActive: { type: 'Boolean', default: true },
  createdAt: 'Date'
};

/*
// Implementación con Mongoose:

const mongoose = require('mongoose');

const interestRateSchema = new mongoose.Schema({
  accountTypeId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountType',
    required: true
  },
  rate: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterestRate', interestRateSchema);
*/
