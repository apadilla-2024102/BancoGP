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

export const createCustomer = async (customerData) => {
  try {
    const response = await customerClient.post('/customers', customerData);
    return handleResponse(response);
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.error || error?.message;
    if (status === 404 || message?.toLowerCase()?.includes('route not found')) {
      const fallbackResponse = await customerClient.post('/customers/register', customerData);
      return handleResponse(fallbackResponse);
    }
    throw error;
  }
};
