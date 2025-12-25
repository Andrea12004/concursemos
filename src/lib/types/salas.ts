export interface Room {
  id: string | number;
  start_date: string | null;
  name?: string;
  [key: string]: any;
}

export interface AuthResponse {
  accesToken: string;
  user: {
    profile: {
      id: string;
    };
  };
}
