import api  from '@/settings/axios';

export const getQuestionsIdEndpoint = async (token: string, questionId: string) => {
  const response = await api.get(`/questions/${questionId}`, {
    headers: {  
        'cnrsms_token': token,  
    }
  });
  return response.data;
};


export const approveQuestionEndpoint = async (questionId: string) => {
  const response = await api.patch(`/questions/${questionId}/approve`);
  return response.data;
};


export const unreportQuestion = async (questionId: string, token: string) => {
  const headers = {
    cnrsms_token: token,
  };

  const response = await api.patch(
    `questions/${questionId}/unreport`,
    {},
    { headers }
  );

  return response.data;
};



export const deleteQuestion = async (
  questionId: string,
  token: string
)=> {
  await api.delete(
    `questions/${questionId}`,
    {
      headers: {
        cnrsms_token: token,
      },
    }
  );
};


export const unapproveQuestion = async (
  questionId: number | string,
  token: string
)=> {
  await api.patch(
    `questions/${questionId}/unapprove`,
    {},
    {
      headers: {
        cnrsms_token: token,
      },
    }
  );
};


export const getAllQuestionsEndpoint = async (token: string) => {
  const response = await api.get('/questions', {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};
