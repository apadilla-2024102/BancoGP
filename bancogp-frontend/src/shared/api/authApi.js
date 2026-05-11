import { authClient, handleResponse } from './apiClient.js';

export const loginUser = async (credentials) => {
  const response = await authClient.post('/auth/login', credentials);
  return handleResponse(response);
};

export const getUserProfile = async () => {
  const response = await authClient.get('/auth/profile');
  return handleResponse(response);
};

export const registerUser = async (userData) => {
  const response = await authClient.post('/auth/register', userData);
  return handleResponse(response);
};

export const verifyEmail = async (token) => {
  const response = await authClient.post('/auth/verify-email', { token });
  return handleResponse(response);
};
