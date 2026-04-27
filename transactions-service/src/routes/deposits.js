const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');
const { depositSchema } = require('../validators/transactionValidator');

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = depositSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    depositController.createDeposit(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:accountId', depositController.getDepositHistory);

module.exports = router;
