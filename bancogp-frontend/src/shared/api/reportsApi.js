import { reportsClient, handleResponse } from './apiClient.js';

export const getStatistics = async () => {
  const response = await reportsClient.get('/reports/statistics');
  return handleResponse(response);
};

export const getFinancialReport = async ({ startDate, endDate, format }) => {
  const response = await reportsClient.get('/reports/financial', {
    params: { startDate, endDate, format }
  });
  return handleResponse(response);
};

export const generateAccountStatement = async (payload) => {
  const response = await reportsClient.post('/reports/account-statement', payload);
  return handleResponse(response);
};
