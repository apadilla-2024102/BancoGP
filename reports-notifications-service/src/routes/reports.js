const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { accountStatementSchema } = require('../validators/reportValidator');

router.post('/account-statement', async (req, res, next) => {
  try {
    const { error, value } = accountStatementSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    reportController.generateAccountStatement(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/financial', reportController.generateFinancialReport);
router.get('/statistics', reportController.getStatistics);

module.exports = router;
