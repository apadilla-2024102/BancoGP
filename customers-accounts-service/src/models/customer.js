// customers-accounts-service/src/models/customer.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const customerSchema = {
  _id: 'ObjectId',
  firstName: 'String',
  lastName: 'String',
  email: 'String',
  phone: 'String',
  documentType: 'String', // DNI, Pasaporte, etc
  documentNumber: 'String',
  address: 'String',
  city: 'String',
  country: 'String',
  status: { type: 'String', enum: ['active', 'inactive', 'suspended'] },
  createdAt: 'Date',
  updatedAt: 'Date'
};

/*
// Implementación con Mongoose:

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  documentType: String,
  documentNumber: { type: String, unique: true },
  address: String,
  city: String,
  country: String,
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
*/
