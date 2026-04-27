const interestRatesController = {
  createInterestRate: async (req, res, next) => {
    try {
      const { accountTypeId, rate, effectiveFrom, effectiveTo } = req.body;
      // TODO: Save to database
      res.status(201).json({
        message: 'Interest rate created',
        interestRateId: 'IR123456',
        accountTypeId,
        rate,
        effectiveFrom,
        effectiveTo
      });
    } catch (error) {
      next(error);
    }
  },

  getInterestRates: async (req, res, next) => {
    try {
      // TODO: Get from database
      res.status(200).json({
        interestRates: []
      });
    } catch (error) {
      next(error);
    }
  },

  getInterestRateByAccountType: async (req, res, next) => {
    try {
      const { accountTypeId } = req.params;
      // TODO: Get from database
      res.status(200).json({
        accountTypeId,
        currentRate: 2.5,
        rates: []
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = interestRatesController;
