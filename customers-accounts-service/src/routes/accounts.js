const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { createAccountSchema } = require('../validators/customerValidator');

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = createAccountSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    accountController.createAccount(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:accountId', accountController.getAccountDetails);
router.get('/:accountId/balance', accountController.getBalance);
router.get('/customer/:customerId', accountController.listCustomerAccounts);

module.exports = router;
