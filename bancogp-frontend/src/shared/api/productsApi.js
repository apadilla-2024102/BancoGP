import { productsClient, handleResponse } from './apiClient.js';

export const getAccountTypes = async () => {
  const response = await productsClient.get('/account-types');
  return handleResponse(response);
};

export const getCurrencies = async () => {
  const response = await productsClient.get('/currencies');
  return handleResponse(response);
};

export const getInterestRates = async () => {
  const response = await productsClient.get('/interest-rates');
  return handleResponse(response);
};

export const convertCurrency = async ({ from, to, amount }) => {
  const response = await productsClient.get('/currencies/convert', {
    params: { from, to, amount }
  });
  return handleResponse(response);
};
