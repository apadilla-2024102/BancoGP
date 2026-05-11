const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const { withdrawalSchema } = require('../validators/transactionValidator');

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = withdrawalSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    withdrawalController.createWithdrawal(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:accountId', withdrawalController.getWithdrawalHistory);

module.exports = router;
