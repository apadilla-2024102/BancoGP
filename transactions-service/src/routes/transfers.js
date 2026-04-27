const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { transferSchema } = require('../validators/transactionValidator');

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = transferSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    transferController.createTransfer(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:accountId', transferController.getTransferHistory);

module.exports = router;
