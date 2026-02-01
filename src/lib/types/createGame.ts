export interface FormData {
  titulo: string;
  tipo: 'publica' | 'privada';
  cantidad: string;
  tiempo: string;
  categoria: number[];
  fecha: string;
  hora: string;
}

export interface AuthResponse {
  accesToken: string;
  user: {
    role: string;
    profile: {
      id: string;
    };
  };
}

export interface Question {
  id: number;
  category: {
    id: number;
    category: string;
  };
  IsAproved: boolean;
}

export interface QuestionsByCategory {
  [categoryId: number]: Question[];
}
