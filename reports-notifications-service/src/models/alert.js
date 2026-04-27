// reports-notifications-service/src/models/alert.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const alertSchema = {
  _id: 'ObjectId',
  userId: 'String',
  accountId: 'String',
  alertType: { type: 'String', enum: ['low_balance', 'high_balance', 'transaction_limit', 'unusual_activity'] },
  threshold: 'Decimal',
  isActive: { type: 'Boolean', default: true },
  createdAt: 'Date',
  lastTriggered: 'Date'
};

/*
// Implementación con Mongoose:

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accountId: { type: String, required: true },
  alertType: { 
    type: String,
    enum: ['low_balance', 'high_balance', 'transaction_limit', 'unusual_activity'],
    required: true
  },
  threshold: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastTriggered: Date
});

module.exports = mongoose.model('Alert', alertSchema);
*/
