const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/transaction');

const CUSTOMERS_SERVICE = process.env.CUSTOMERS_SERVICE_URL || 'http://localhost:3001';

const withdrawalController = {
  createWithdrawal: async (req, res, next) => {
    try {
      const { accountId, amount, description } = req.body;
      const amountValue = Number(amount);
      if (!accountId || Number.isNaN(amountValue) || amountValue <= 0) return res.status(400).json({ error: 'Invalid input' });

      // Check balance
      const balResp = await axios.get(`${CUSTOMERS_SERVICE}/api/accounts/${accountId}/balance`, { headers: { Authorization: req.headers.authorization || '' } });
      const current = balResp.data.balance || 0;
      if (current < amountValue) return res.status(400).json({ error: 'Insufficient funds' });

      // Decrease balance
      const resp = await axios.patch(`${CUSTOMERS_SERVICE}/api/accounts/${accountId}/balance`, { delta: -amountValue }, { headers: { Authorization: req.headers.authorization || '' } });

      const txn = new Transaction({
        transactionId: uuidv4(),
        type: 'withdrawal',
        amount: amountValue,
        fromAccountId: accountId,
        status: 'completed',
        description
      });
      await txn.save();

      res.status(201).json({ message: 'Withdrawal successful', transaction: txn, newBalance: resp.data.balance });
    } catch (error) {
      next(error);
    }
  },

  getWithdrawalHistory: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      const withdrawals = await Transaction.find({ fromAccountId: accountId, type: 'withdrawal' }).sort({ timestamp: -1 }).lean();
      res.status(200).json({ accountId, withdrawals });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = withdrawalController;
