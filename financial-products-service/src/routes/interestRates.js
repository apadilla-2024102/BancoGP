/**
 * @swagger
 * tags:
 *   name: InterestRates
 *   description: Tasas de interés por tipo de cuenta
 */

const express = require('express');
const router = express.Router();
const interestRatesController = require('../controllers/interestRatesController');
const { interestRateSchema } = require('../validators/productValidator');

/**
 * @swagger
 * /api/interest-rates:
 *   post:
 *     tags: [InterestRates]
 *     summary: Crear una nueva tasa de interés
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountTypeId, rate, effectiveFrom]
 *             properties:
 *               accountTypeId:
 *                 type: string
 *               rate:
 *                 type: number
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *               effectiveTo:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tasa de interés creada
 *       400:
 *         description: Error de validación
 */
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = interestRateSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    interestRatesController.createInterestRate(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/interest-rates:
 *   get:
 *     tags: [InterestRates]
 *     summary: Obtener todas las tasas de interés
 *     responses:
 *       200:
 *         description: Lista de tasas de interés
 */
router.get('/', interestRatesController.getInterestRates);

/**
 * @swagger
 * /api/interest-rates/account-type/{accountTypeId}:
 *   get:
 *     tags: [InterestRates]
 *     summary: Obtener tasas de interés por tipo de cuenta
 *     parameters:
 *       - in: path
 *         name: accountTypeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasas para el tipo de cuenta solicitado
 *       404:
 *         description: Tipo de cuenta no encontrado
 */
router.get('/account-type/:accountTypeId', interestRatesController.getInterestRateByAccountType);

module.exports = router;
