require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./utils/errorHandler');
const customerRoutes = require('./routes/customers');
const accountRoutes = require('./routes/accounts');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'customers-accounts-service' });
});

// Routes
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/accounts', authMiddleware, accountRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
