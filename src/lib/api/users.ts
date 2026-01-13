import axios from "axios";
export const registerUserEndpoint = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  blocked: boolean;
  authStrategy: string;
}) => {
  const response = await axios.post('/users/register', payload);
  return response.data;
};

export const updateUserBlockStatusEndpoint = async (
  userId: string | number,
  blocked: boolean,
  token: string
) => {
  const response = await axios.put(
    `/users/edit/${userId}`,
    { blocked },
    {
      headers: {
        'cnrsms_token': token,
      }
    }
  );
  return response.data;
};

export const deleteUserEndpoint = async (userId: string | number, token: string) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.delete(`users/delete/${userId}`, { headers });
  return response.data;
};

export const updateUserEndpoint = async (
  userId: string | number,
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.put(`users/edit/${userId}`, userData, { headers });
  return response.data;
};



// ⭐ Función para verificar/desverificar usuario
export const updateUserVerificationEndpoint = async (
  userId: string | number,
  verified: boolean,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.put(
    `users/edit/${userId}`, 
    { verified }, 
    { headers }
  );
  return response.data;
};
