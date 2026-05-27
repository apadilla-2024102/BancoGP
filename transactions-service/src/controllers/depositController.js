const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/transaction');

const CUSTOMERS_SERVICE = process.env.CUSTOMERS_SERVICE_URL || 'http://localhost:3001';

const depositController = {
  createDeposit: async (req, res, next) => {
    try {
      const { accountId, amount, description } = req.body;
      const amountValue = Number(amount);
      if (!accountId || Number.isNaN(amountValue) || amountValue <= 0) return res.status(400).json({ error: 'Invalid input' });

      // Update account balance via customers service
      const resp = await axios.patch(`${CUSTOMERS_SERVICE}/api/accounts/${accountId}/balance`, { delta: amountValue }, { headers: { Authorization: req.headers.authorization || '' } });

      const txn = new Transaction({
        transactionId: uuidv4(),
        type: 'deposit',
        amount: amountValue,
        toAccountId: accountId,
        status: 'completed',
        description
      });
      await txn.save();

      res.status(201).json({ message: 'Deposit successful', transaction: txn, newBalance: resp.data.balance });
    } catch (error) {
      next(error);
    }
  },

  getDepositHistory: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      const deposits = await Transaction.find({ toAccountId: accountId, type: 'deposit' }).sort({ timestamp: -1 }).lean();
      res.status(200).json({ accountId, deposits });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = depositController;
