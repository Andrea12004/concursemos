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

//get room by code
export const getRoomByCodeEndpoint = async (token: string, roomCode: string) => {
  const response = await api.get(`/rooms/by-code/${roomCode}`, {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};

//post send_data

export const sendSyncDataEndpoint = async (token: string, data: {
  numberQuestion: number;
  time: number;
  includeQuestions: boolean;
  roomId: string;
}) => {
  const response = await api.post('/rooms/send-data', data, {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};