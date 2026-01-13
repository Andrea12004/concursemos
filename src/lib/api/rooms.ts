import axios from "axios";

//get 
export const getAllRoomsEndpoint = async (token: string) => {
  const response = await axios.get('/rooms/all', {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};

//get room by code
export const getRoomByCodeEndpoint = async (token: string, roomCode: string) => {
  const response = await axios.get(`/rooms/by-code/${roomCode}`, {
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
  const response = await axios.post('/rooms/send-data', data, {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};

export const deleteRoomEndpoint = async (token: string, roomId: string) => {
  const response = await axios.delete(`/rooms/${roomId}`, {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};