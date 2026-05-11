import { transactionsClient, handleResponse } from './apiClient.js';

export const createDeposit = async (payload) => {
  const response = await transactionsClient.post('/deposits', payload);
  return handleResponse(response);
};

export const createWithdrawal = async (payload) => {
  const response = await transactionsClient.post('/withdrawals', payload);
  return handleResponse(response);
};

export const createTransfer = async (payload) => {
  const response = await transactionsClient.post('/transfers', payload);
  return handleResponse(response);
};

export const getDepositHistory = async (accountId) => {
  const response = await transactionsClient.get(`/deposits/${accountId}`);
  return handleResponse(response);
};

export const getWithdrawalHistory = async (accountId) => {
  const response = await transactionsClient.get(`/withdrawals/${accountId}`);
  return handleResponse(response);
};

export const getTransferHistory = async (accountId) => {
  const response = await transactionsClient.get(`/transfers/${accountId}`);
  return handleResponse(response);
};
