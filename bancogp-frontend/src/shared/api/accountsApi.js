import { customerClient, handleResponse } from './apiClient.js';

export const createAccount = async (payload) => {
  const response = await customerClient.post('/accounts', payload);
  return handleResponse(response);
};

export const getAccountDetails = async (accountId) => {
  const response = await customerClient.get(`/accounts/${accountId}`);
  return handleResponse(response);
};

export const getAccountBalance = async (accountId) => {
  const response = await customerClient.get(`/accounts/${accountId}/balance`);
  return handleResponse(response);
};
