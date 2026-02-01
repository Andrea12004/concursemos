import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setLogin } from '@/lib/store/authSlice';
import { getUserIdFromToken, isTokenExpired } from '@/lib/services/Redux/Jwtutils';
import { getUserByIdEndpoint } from '@/lib/api/users';
import { useLogout } from '@/lib/hooks/useLogout';


export const useAuthInit = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { logout } = useLogout();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Solo inicializar una vez
    if (hasInitialized.current) return;

    const initAuth = async () => {
      // Si ya hay usuario en Redux, no hacer nada
      if (user) {
        hasInitialized.current = true;
        return;
      }

      // Buscar token en localStorage
      const token = localStorage.getItem('authToken') ||
        localStorage.getItem('cnrsms_token');

      if (!token) {
        hasInitialized.current = true;
        return;
      }

      // Verificar si el token está expirado
      if (isTokenExpired(token)) {
        console.log('Token expirado, cerrando sesión...');
        logout();
        hasInitialized.current = true;
        return;
      }

      try {
        // Decodificar token para obtener userId
        const userId = getUserIdFromToken(token);

        if (!userId) {
          console.error('No se pudo extraer userId del token');
          logout();
          hasInitialized.current = true;
          return;
        }

        // Obtener datos completos del usuario desde la API
        const userData = await getUserByIdEndpoint(userId, token);

        if (!userData) {
          console.error('No se pudo obtener datos del usuario');
          logout();
          hasInitialized.current = true;
          return;
        }

        // Guardar en Redux
        dispatch(setLogin({
          user: userData,
          profile: userData.profile,
          token: token
        }));

        hasInitialized.current = true;

      } catch (error: any) {
        console.error('Error inicializando autenticación:', error);

        // Si es error de token expirado o no autorizado, cerrar sesión
        if (error?.response?.status === 401 ||
          error?.response?.data?.message?.includes('Token expirado')) {
          logout();
        }

        hasInitialized.current = true;
      }
    };

    initAuth();
  }, [user, dispatch, logout]);
};