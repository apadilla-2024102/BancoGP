import axios from 'axios';

const getAuthToken = () => {
  try {
    const auth = localStorage.getItem('bancogp_auth');
    if (!auth) return null;
    return JSON.parse(auth).token;
  } catch {
    return null;
  }
};

const createClient = (baseURL) => {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

export const authClient = createClient(import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/v1');
export const customerClient = createClient(import.meta.env.VITE_CUSTOMER_API_URL || 'http://localhost:3001/api');
export const transactionsClient = createClient(import.meta.env.VITE_TRANSACTION_API_URL || 'http://localhost:3002/api');
export const productsClient = createClient(import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:3003/api');
export const reportsClient = createClient(import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:3004/api');

export const handleResponse = (response) => {
  if (!response) return {};
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  return response.data || {};
};
