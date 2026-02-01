import axios from "axios";

export const getQuestionsIdEndpoint = async (token: string, questionId: string) => {
  const response = await axios.get(`/questions/${questionId}`, {
    headers: {  
        'cnrsms_token': token,  
    }
  });
  return response.data;
};


export const approveQuestionEndpoint = async (questionId: string, token: string) => {
  const response = await axios.patch(`/questions/${questionId}/approve`, {}, {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};


export const unreportQuestion = async (questionId: string, token: string) => {
  const headers = {
    cnrsms_token: token,
  };

  const response = await axios.patch(
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
  await axios.delete(
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
  await axios.patch(
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
  const response = await axios.get('/questions', {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};


export  interface QuestionCategory {
  id: string | number;
  category: string;
  photo_category: string;
}

export const updateQuestionCategoryEndpoint = async (
  categoryId: string | number,
  categoryData: FormData,
  token: string
) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'cnrsms_token': token,
  };

  const response = await axios.put(
    `questions-category/edit/${categoryId}`,
    categoryData,
    { headers }
  );
  
  return response.data;
};

export const getAllQuestionCategoriesEndpoint = async (token: string) => {
  const response = await axios.get('/questions-category/all', {
    headers: {
      'cnrsms_token': token,
    }
  });
  return response.data;
};


export const deleteQuestionCategoryEndpoint = async (
  categoryId: string | number,
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.delete(
    `questions-category/delete/${categoryId}`,
    { headers }
  );
  
  return response.data;
};





export const assignQuestionsToRoomEndpoint = async (
  roomId: string | number,
  questionIds: (string | number)[],
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.patch(
    `/questions/${roomId}/questions`,
    questionIds,
    { headers }
  );
  return response.data;
};


export const createQuestionEndpoint = async (
  profileId: string | number,
  questionData: {
    text: string;
    IsAproved: boolean;
    isReported: boolean;
    answers: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    categoryId: string | number;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/questions/${profileId}`,
    questionData,
    { headers }
  );
  return response.data;
};

export const createQuestionCategoryEndpoint = async (
  categoryData: FormData,
  token: string
) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'cnrsms_token': token,
  };

  const response = await axios.post(
    `/questions-category/create`,
    categoryData,
    { headers }
  );
  return response.data;
};


export const updateQuestionEndpoint = async (
  questionId: string | number,
  questionData: {
    text: string;
    IsAproved: boolean;
    isReported: boolean;
    answers: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    categoryId: string | number;
  },
  token: string
) => {
  const headers = {
    'cnrsms_token': token,
  };

  const response = await axios.put(
    `/questions/${questionId}`,
    questionData,
    { headers }
  );
  return response.data;
};


