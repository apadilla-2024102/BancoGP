// reports-notifications-service/src/models/notification.js
// Este es un modelo de ejemplo que puede ser implementado con Mongoose

const notificationSchema = {
  _id: 'ObjectId',
  userId: 'String',
  type: 'String', // email, sms, push, in-app
  message: 'String',
  priority: { type: 'String', enum: ['low', 'medium', 'high'] },
  isRead: { type: 'Boolean', default: false },
  createdAt: 'Date',
  readAt: 'Date'
};

/*
// Implementación con Mongoose:

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { 
    type: String,
    enum: ['email', 'sms', 'push', 'in-app'],
    required: true
  },
  message: { type: String, required: true },
  priority: { 
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: Date
});

module.exports = mongoose.model('Notification', notificationSchema);
*/
