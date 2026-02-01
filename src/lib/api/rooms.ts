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

export const getScheduledRoomsEndpoint = async (
  profileId: string | number,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.get(
    `/rooms/${profileId}/scheduled-rooms`,
    { headers }
  );
  return response.data;
};


export const createRoomEndpoint = async (
  roomData: {
    profileId: string | number;
    room_name: string;
    state: 'PROGRAMADA' | 'EN_DIRECTO';
    max_user: number;
    room_code: string;
    issue: string;
    number_questions: string | number;
    time_question: string | number;
    start_date?: string;
    start_time?: number;
    chat_enable: boolean;
    categoryIds: (string | number)[];
    is_private: boolean;
    author: boolean;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/rooms/create`,
    roomData,
    { headers }
  );
  return response.data;
};