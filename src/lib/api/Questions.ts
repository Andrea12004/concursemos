import api  from '@/settings/axios';

export const getQuestionsIdEndpoint = async (token: string, questionId: string) => {
  const response = await api.get(`/questions/${questionId}`, {
    headers: {  
        'cnrsms_token': token,  
    }
  });
  return response.data;
};