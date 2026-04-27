const currenciesController = {
  createCurrency: async (req, res, next) => {
    try {
      const { code, name, symbol, exchangeRate } = req.body;
      // TODO: Save to database
      res.status(201).json({
        message: 'Currency created',
        currencyId: 'CUR123456',
        code,
        name,
        symbol,
        exchangeRate
      });
    } catch (error) {
      next(error);
    }
  },

  getCurrencies: async (req, res, next) => {
    try {
      // TODO: Get from database
      res.status(200).json({
        currencies: [
          { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0 },
          { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92 },
          { code: 'MXN', name: 'Mexican Peso', symbol: '$', exchangeRate: 17.05 }
        ]
      });
    } catch (error) {
      next(error);
    }
  },

  convertCurrency: async (req, res, next) => {
    try {
      const { fromCurrency, toCurrency, amount } = req.query;
      // TODO: Implement conversion logic
      res.status(200).json({
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount: amount * 0.92
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = currenciesController;
