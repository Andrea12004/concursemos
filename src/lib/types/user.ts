export interface UserProfile {
  id: string | number;
  nickname: string;
  level: string;
  City: string;
  Total_points: number;
  correct_answers: number;
  Rooms_win: number;
  [key: string]: any;
}

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'BASIC';
  blocked: boolean;
  verified: boolean;
  lastPaymentDate: string | null;
  profile: UserProfile;
  [key: string]: any;
}