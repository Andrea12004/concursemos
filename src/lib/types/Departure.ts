export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Category {
  category: string;
  photo_category: string;
}

export interface GameData {
  questions: Question[];
}

export interface GameState {
  roomId: string;
  startGame: boolean;
  questions: Question[];
}

export interface PlayerScore {
  id: string;
  nickname: string;
  totalScore: number;
  photoUrl?: string;
}

export interface GameEndResult {
  finalScores: PlayerScore[];
}
