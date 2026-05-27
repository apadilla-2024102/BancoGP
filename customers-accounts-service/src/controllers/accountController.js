const Account = require('../models/account');
const Customer = require('../models/customer');
const mongoose = require('mongoose');

function generateAccountNumber() {
  // simple random 10-digit account number
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const accountController = {
  createAccount: async (req, res, next) => {
    try {
      const { customerId, accountType, initialBalance } = req.body;
      const customer = await Customer.findById(customerId);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });

      let accountNumber = generateAccountNumber();
      // ensure uniqueness
      while (await Account.findOne({ accountNumber })) {
        accountNumber = generateAccountNumber();
      }

      const account = new Account({
        accountNumber,
        customerId,
        accountType,
        balance: initialBalance || 0
      });
      await account.save();
      res.status(201).json({ message: 'Account created successfully', account });
    } catch (error) {
      next(error);
    }
  },

  getBalance: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      let account = null;
      // try by ObjectId first
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        account = await Account.findById(accountId).lean();
      }
      // fallback to accountNumber
      if (!account) {
        account = await Account.findOne({ accountNumber: accountId }).lean();
      }
      if (!account) return res.status(404).json({ error: 'Account not found' });
      res.status(200).json({ accountId: account._id, balance: account.balance, currency: account.currency });
    } catch (error) {
      next(error);
    }
  },

  getAccountDetails: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      let account = null;
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        account = await Account.findById(accountId).populate('customerId', 'firstName lastName email').lean();
      }
      if (!account) {
        account = await Account.findOne({ accountNumber: accountId }).populate('customerId', 'firstName lastName email').lean();
      }
      if (!account) return res.status(404).json({ error: 'Account not found' });
      res.status(200).json(account);
    } catch (error) {
      next(error);
    }
  },

  listCustomerAccounts: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const accounts = await Account.find({ customerId }).lean();
      res.status(200).json({ customerId, accounts });
    } catch (error) {
      next(error);
    }
  }
,

  updateBalance: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      const { delta } = req.body; // positive or negative number
      if (typeof delta !== 'number') return res.status(400).json({ error: 'delta must be a number' });

      let account = null;
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        account = await Account.findById(accountId);
      }
      if (!account) {
        account = await Account.findOne({ accountNumber: accountId });
      }

      if (!account) return res.status(404).json({ error: 'Account not found' });
      account.balance = (account.balance || 0) + delta;
      await account.save();
      res.status(200).json({ message: 'Balance updated', accountId: account._id, balance: account.balance });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = accountController;
