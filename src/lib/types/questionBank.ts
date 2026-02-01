// /src/types/index.ts
export interface Answer {
  text: string;
  [key: string]: any;
}

export interface Category {
  id: string | number;
  category: string;
  [key: string]: any;
}

export interface Author {
  id: string | number;
  [key: string]: any;
}

export interface Question {
  id: string | number;
  text: string;
  author: Author;
  answers: Answer[];
  IsAproved?: boolean;
  isReported?: boolean;
  category: Category;
  [key: string]: any;
}

export interface User {
  role?: string;
  profile?: { id?: string | number } | any;
  [key: string]: any;
}

export interface AuthResponse {
  accesToken: string;
  accessToken?: string;
  user: User;
}