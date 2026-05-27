const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/transaction');

const CUSTOMERS_SERVICE = process.env.CUSTOMERS_SERVICE_URL || 'http://localhost:3001';

const transferController = {
  createTransfer: async (req, res, next) => {
    try {
      const { fromAccountId, toAccountId, amount, description } = req.body;
      const amountValue = Number(amount);
      
      // Validate input
      if (!fromAccountId || !toAccountId || Number.isNaN(amountValue)) {
        return res.status(400).json({ error: 'Missing required fields: fromAccountId, toAccountId, amount' });
      }
      
      if (amountValue <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }
      
      if (fromAccountId === toAccountId) {
        return res.status(400).json({ error: 'Cannot transfer to the same account' });
      }

      // Check from balance
      const fromBal = await axios.get(`${CUSTOMERS_SERVICE}/api/accounts/${fromAccountId}/balance`, { headers: { Authorization: req.headers.authorization || '' } });
      if ((fromBal.data.balance || 0) < amountValue) return res.status(400).json({ error: 'Insufficient funds' });
      
      // Decrease from
      const dec = await axios.patch(`${CUSTOMERS_SERVICE}/api/accounts/${fromAccountId}/balance`, { delta: -amountValue }, { headers: { Authorization: req.headers.authorization || '' } });
      // Increase to
      const inc = await axios.patch(`${CUSTOMERS_SERVICE}/api/accounts/${toAccountId}/balance`, { delta: amountValue }, { headers: { Authorization: req.headers.authorization || '' } });

      const txn = new Transaction({
        transactionId: uuidv4(),
        type: 'transfer',
        amount: amountValue,
        fromAccountId,
        toAccountId,
        status: 'completed',
        description
      });
      await txn.save();

      res.status(201).json({ message: 'Transfer successful', transaction: txn, fromBalance: dec.data.balance, toBalance: inc.data.balance });
    } catch (error) {
      next(error);
    }
  },

  getTransferHistory: async (req, res, next) => {
    try {
      const { accountId } = req.params;
      const transfers = await Transaction.find({ $or: [ { fromAccountId: accountId }, { toAccountId: accountId } ], type: 'transfer' }).sort({ timestamp: -1 }).lean();
      res.status(200).json({ accountId, transfers });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transferController;
