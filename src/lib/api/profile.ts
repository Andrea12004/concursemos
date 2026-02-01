import axios from "axios";

//post
export const ProfileEndpoint = async (payload: {
  userId: string;
  nickname: string;
  City: string;
}) => {
  const response = await axios.post('/profiles', payload);
  return response.data;
};

//get - Obtener perfil por userId
export const getProfileEndpoint = async (userId: string) => {
  const response = await axios.get(`/profiles/${userId}`);
  return response.data;
};

// GET - Obtener todos los perfiles
export const getAllProfilesEndpoint = async (
  token: string,
  search?: string
) => {
  const params: any = {};

  if (search) {
    params.search = search;
  }

  const response = await axios.get('/profiles/all', {
    headers: { 'cnrsms_token': token },
    params
  });

  return response.data;
};

export const getProfileByIdEndpoint = async (
  profileId: string | number,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.get(
    `/profiles/${profileId}`,
    { headers }
  );
  return response.data;
};

export const editProfileEndpoint = async (
  profileId: string | number,
  profileData: FormData,
  token: string
) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'cnrsms_token': token,
  };

  const response = await axios.put(
    `/profiles/edit/${profileId}`,
    profileData,
    { headers }
  );
  return response.data;
};