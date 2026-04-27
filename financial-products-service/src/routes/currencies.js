/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: Divisas y tipos de cambio
 */

const express = require('express');
const router = express.Router();
const currenciesController = require('../controllers/currenciesController');
const { currencySchema } = require('../validators/productValidator');

/**
 * @swagger
 * /api/currencies:
 *   post:
 *     tags: [Currencies]
 *     summary: Crear una divisa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, symbol, exchangeRate]
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código ISO de 3 letras
 *               name:
 *                 type: string
 *               symbol:
 *                 type: string
 *               exchangeRate:
 *                 type: number
 *                 description: Tipo de cambio relativo al USD
 *     responses:
 *       201:
 *         description: Divisa creada
 *       400:
 *         description: Error de validación
 */
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = currencySchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    currenciesController.createCurrency(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/currencies:
 *   get:
 *     tags: [Currencies]
 *     summary: Obtener todas las divisas disponibles
 *     responses:
 *       200:
 *         description: Lista de divisas
 */
router.get('/', currenciesController.getCurrencies);

/**
 * @swagger
 * /api/currencies/convert:
 *   get:
 *     tags: [Currencies]
 *     summary: Convertir entre dos divisas
 *     parameters:
 *       - in: query
 *         name: fromCurrency
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: toCurrency
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Resultado de la conversión
 *       400:
 *         description: Parámetros inválidos
 */
router.get('/convert', currenciesController.convertCurrency);

module.exports = router;
