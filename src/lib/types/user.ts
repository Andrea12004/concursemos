export interface UserProfile {
  nickname: string;
  City: string;
  // Nivel representa el identificador de imagen de nivel (ej. 'BALLENA', 'DELFIN')
  level: string;
  Total_points: number;
}

export interface User {
  id: string;
  profile: UserProfile;
  lastName: string;
  role: string;
  lastPaymentDate: string | null;
  verified: boolean;
  firstName?: string;
  name?: string; // agrega nombre completo si está disponible
  email?: string;
  blocked?: boolean;
}
