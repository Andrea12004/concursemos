import api from '@/settings/axios';

export const loginEndpoint = async (payload: { username: string; password: string; signal?: AbortSignal }) => {
 const response = await api.post('/auth/login', payload);
 return response.data; 
};


export const requestResetPasswordEndpoint = async (payload: { email: string ; signal?: AbortSignal}) => {
  const response = await api.post('/auth/request-reset-password', payload);
  return response.data; 
};

export const ResetPasswordEndpoint = async (payload: { token: string ; newPassword: string ; signal?: AbortSignal}) => {
  const response = await api.post('/auth/reset-password', payload);
  return response.data; 
};