// financial-products-service/src/models/accountType.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const accountTypeSchema = {
  _id: 'ObjectId',
  name: 'String',
  description: 'String',
  minimumBalance: 'Decimal',
  maximumBalance: 'Decimal',
  monthlyFee: 'Decimal',
  isActive: { type: 'Boolean', default: true },
  createdAt: 'Date'
};

/*
// Implementación con Mongoose:

const mongoose = require('mongoose');

const accountTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  minimumBalance: Number,
  maximumBalance: Number,
  monthlyFee: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccountType', accountTypeSchema);
*/
