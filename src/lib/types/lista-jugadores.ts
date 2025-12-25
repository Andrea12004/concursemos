export interface Player {
  id: string;
  profileId?: string;
  nickname: string;
  photoUrl?: string;
  pointsAwarded?: number;
  score?: number;
  correct_answers?: number;
  verified?: boolean;
}

export interface PlayerScoreLocal {
  id: string;
  nickname: string;
  totalScore: number;
  photoUrl?: string;
}

export interface Profile {
  id: string;
  nickname: string;
  photoUrl?: string;
}

export interface User {
  id: string;
  profile: Profile;
}

export interface AuthResponse {
  accesToken: string;
  user: User;
}

export interface ListaJugadoresProps {
  timeup?: boolean;
  final?: PlayerScoreLocal[];
  setFinal?: (players: PlayerScoreLocal[]) => void;
}
