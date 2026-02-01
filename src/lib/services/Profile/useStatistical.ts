// useStatistical.ts - VERSIÓN SIMPLE Y RÁPIDA
import { useAppSelector } from "@/lib/store/hooks";

interface UserProfile {
  profile: {
    level: string;
    correct_answers: number;
    Total_points: number;
    Rooms_win: number;
  };
}

export const useEstadisticasPerfilLogic = () => {
  const { profile } = useAppSelector((state) => state.auth);

  // Construir el objeto en el formato que espera tu componente
  const userStats: UserProfile | null = profile ? {
    profile: {
      level: profile.level || 'N/A',
      correct_answers: profile.correct_answers || 0,
      Total_points: profile.Total_points || 0,
      Rooms_win: profile.Rooms_win || 0,
    }
  } : null;

  return {
    loading: !profile,
    userStats
  };
};