const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { registerCustomerSchema, updateCustomerSchema } = require('../validators/customerValidator');

const validateAndRegister = async (req, res, next) => {
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
};

router.post('/', validateAndRegister);
router.post('/register', validateAndRegister);

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
