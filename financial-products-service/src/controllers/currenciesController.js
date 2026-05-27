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
      const fromCurrency = req.query.fromCurrency || req.query.from || 'USD';
      const toCurrency = req.query.toCurrency || req.query.to || 'EUR';
      const amount = Number(req.query.amount ?? 0);

      const rates = {
        USD: 1.0,
        EUR: 0.92,
        MXN: 17.05
      };
      const fromRate = rates[fromCurrency] ?? 1.0;
      const toRate = rates[toCurrency] ?? 1.0;
      const convertedAmount = amount > 0 ? Number(((amount / fromRate) * toRate).toFixed(2)) : 0;

      res.status(200).json({
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = currenciesController;
