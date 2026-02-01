

export interface Profile {
  id: string;
  userId: string;
  nickname: string; 
  photoUrl?: string;
  sucription?: boolean;
  level?: string;
  Rooms_win?: number;
  Total_points?: number;
  correct_answers?: number;
  City: string; 
  CC?: number;
  Gender?: string;
  WhatsAppGroup?: string;
  Chat_enable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  firstName: string; 
  lastName: string;
  email: string;
  role?: string;
  blocked?: boolean;
  blockedbypay?: boolean;
  verified?: boolean;
  authStrategy: string;
  lastPaymentDate?: string;
  resetPasswordToken?: string;
  profile?: Profile;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  profile?: Profile; 
  accessToken?: string; 
  accesToken?: string; 
  token?: string; 
  refreshToken?: string;
}

export interface LoginRequest {
  username: string; 
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}