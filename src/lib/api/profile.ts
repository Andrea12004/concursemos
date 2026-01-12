import api  from '@/settings/axios';

//post
export const ProfileEndpoint = async (payload: {
  userId: string;
  nickname: string;
  City: string;
}) => {
  const response = await api.post('/profiles', payload);
  return response.data;
};

//get - Obtener perfil por userId
export const getProfileEndpoint = async (userId: string) => {
  const response = await api.get(`/profiles/${userId}`);
  return response.data;
};


// GET - Obtener todos los perfiles (para ranking)
export const getAllProfilesEndpoint = async (token: string) => {
  const response = await api.get('/profiles/all', {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};

export const getProfileByIdEndpoint = async (token: string, playerId: string) => {
  const response = await api.get(`/profiles/${playerId}`, {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};