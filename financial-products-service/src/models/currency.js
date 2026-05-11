// financial-products-service/src/models/currency.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const currencySchema = {
  _id: 'ObjectId',
  code: 'String', // USD, EUR, MXN, etc
  name: 'String',
  symbol: 'String',
  exchangeRate: 'Decimal', // Relativo a USD
  isActive: { type: 'Boolean', default: true },
  lastUpdated: 'Date'
};

/*
// Implementación con Mongoose:

const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, length: 3 },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  exchangeRate: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Currency', currencySchema);
*/
