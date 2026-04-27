const accountTypesController = {
  createAccountType: async (req, res, next) => {
    try {
      const { name, description, minimumBalance, maximumBalance, monthlyFee } = req.body;
      // TODO: Save to database
      res.status(201).json({
        message: 'Account type created',
        accountTypeId: 'AT123456',
        name,
        description,
        minimumBalance,
        maximumBalance,
        monthlyFee
      });
    } catch (error) {
      next(error);
    }
  },

  getAccountTypes: async (req, res, next) => {
    try {
      // TODO: Get from database
      res.status(200).json({
        accountTypes: [
          { id: 'AT1', name: 'Savings', description: 'Regular savings account' },
          { id: 'AT2', name: 'Checking', description: 'Checking account' }
        ]
      });
    } catch (error) {
      next(error);
    }
  },

  getAccountType: async (req, res, next) => {
    try {
      const { accountTypeId } = req.params;
      // TODO: Get from database
      res.status(200).json({
        accountTypeId,
        name: 'Savings',
        description: 'Regular savings account'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = accountTypesController;
