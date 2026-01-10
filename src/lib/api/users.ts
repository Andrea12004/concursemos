import api  from '@/settings/axios';

export const registerUserEndpoint = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  blocked: boolean;
  authStrategy: string;
}) => {
  const response = await api.post('/users/register', payload);
  return response.data;
};

