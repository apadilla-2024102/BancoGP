require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./utils/errorHandler');
const depositRoutes = require('./routes/deposits');
const withdrawalRoutes = require('./routes/withdrawals');
const transferRoutes = require('./routes/transfers');

const app = express();

// Disable ETag and prevent browser caching on transaction API routes
app.disable('etag');

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'transactions-service' });
});

// Routes
app.use('/api/deposits', authMiddleware, depositRoutes);
app.use('/api/withdrawals', authMiddleware, withdrawalRoutes);
app.use('/api/transfers', authMiddleware, transferRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
