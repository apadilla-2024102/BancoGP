const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { registerCustomerSchema, updateCustomerSchema } = require('../validators/customerValidator');

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerCustomerSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    customerController.registerCustomer(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/', customerController.listCustomers);
router.get('/:customerId', customerController.getCustomer);

router.put('/:customerId', async (req, res, next) => {
  try {
    const { error, value } = updateCustomerSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    customerController.updateCustomer(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
