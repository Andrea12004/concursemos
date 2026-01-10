export interface Category {
  id: string;
  category: string;
  photo_category: string;
}

export interface CategoriasUser {
  profile: {
    id: string;
  };
  role?: string;
}

export interface CategoriasAuthResponse {
  accesToken: string;
  user: CategoriasUser;
}
