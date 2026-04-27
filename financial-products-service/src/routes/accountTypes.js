/**
 * @swagger
 * tags:
 *   name: AccountTypes
 *   description: Tipos de cuenta
 */

const express = require('express');
const router = express.Router();
const accountTypesController = require('../controllers/accountTypesController');
const { accountTypeSchema } = require('../validators/productValidator');

/**
 * @swagger
 * /api/account-types:
 *   post:
 *     tags: [AccountTypes]
 *     summary: Crear un tipo de cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, minimumBalance]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               minimumBalance:
 *                 type: number
 *                 minimum: 0
 *               maximumBalance:
 *                 type: number
 *                 minimum: 0
 *               monthlyFee:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Tipo de cuenta creado
 *       400:
 *         description: Error de validación
 */
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = accountTypeSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    accountTypesController.createAccountType(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/account-types:
 *   get:
 *     tags: [AccountTypes]
 *     summary: Obtener todos los tipos de cuenta
 *     responses:
 *       200:
 *         description: Lista de tipos de cuenta
 */
router.get('/', accountTypesController.getAccountTypes);

/**
 * @swagger
 * /api/account-types/{accountTypeId}:
 *   get:
 *     tags: [AccountTypes]
 *     summary: Obtener un tipo de cuenta por ID
 *     parameters:
 *       - in: path
 *         name: accountTypeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del tipo de cuenta
 *       404:
 *         description: Tipo de cuenta no encontrado
 */
router.get('/:accountTypeId', accountTypesController.getAccountType);

module.exports = router;
