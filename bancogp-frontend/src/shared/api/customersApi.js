import { customerClient, handleResponse } from './apiClient.js';

export const getCustomers = async () => {
  const response = await customerClient.get('/customers');
  return handleResponse(response);
};

export const getCustomerAccounts = async (customerId) => {
  const response = await customerClient.get(`/accounts/customer/${customerId}`);
  return handleResponse(response);
};

export const getCustomer = async (customerId) => {
  const response = await customerClient.get(`/customers/${customerId}`);
  return handleResponse(response);
};
