require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./utils/errorHandler');
const accountTypesRoutes = require('./routes/accountTypes');
const currenciesRoutes = require('./routes/currencies');
const interestRatesRoutes = require('./routes/interestRates');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Financial Products Service API',
    version: '1.0.0',
    description: 'Documentación de los endpoints de productos financieros, tipos de cuenta, tasas e intercambio de divisas.'
  },
  servers: [
    {
      url: 'http://localhost:3003/api',
      description: 'Servidor local'
    }
  ]
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'financial-products-service' });
});

app.use('/api/account-types', accountTypesRoutes);
app.use('/api/currencies', currenciesRoutes);
app.use('/api/interest-rates', interestRatesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
