import api from '@/settings/axios';

//get 
export const getAllRoomsEndpoint = async (token: string) => {
  const response = await api.get('/rooms/all', {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};