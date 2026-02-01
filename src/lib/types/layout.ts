export interface User {
  role: string;
  lastPaymentDate: string | null;
  profile: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface HeaderProps {
  setSearchQuery: (query: string) => void;
}

export interface Notification {
  text: string;
  message?: string;
}