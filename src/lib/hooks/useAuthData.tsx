import { useAppSelector } from '@/lib/store/hooks';

/**
 * Hook simplificado para acceder a los datos de autenticación
 * Solo lee de Redux, NO inicializa ni hace llamadas a la API
 * 
 * Usar este hook en cualquier componente que necesite acceder a:
 * - Información del usuario
 * - Información del perfil
 * - Nickname del usuario
 * 
 * La inicialización de datos se maneja en useAuthInit (App.tsx)
 */
export const useAuthData = () => {
  const { user, profile } = useAppSelector((state) => state.auth);

  return {
    user,
    profile,
    nickname: profile?.nickname || user?.profile?.nickname || "Usuario",
    isAuthenticated: !!user,
    role: user?.role || null,
    userId: user?.id || null,
    profileId: profile?.id || user?.profile?.id || null,
  };
};