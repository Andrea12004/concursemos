// hooks/useAuthData.ts
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setLogin } from '@/lib/store/authSlice';
import { getProfileEndpoint } from '@/lib/api/profile';

export const useAuthData = () => {
  const { user, profile } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      // Si ya tenemos datos, no hacer nada
      if (user && profile) return;
      
      // Obtener datos de localStorage
      const authResponse = localStorage.getItem('authResponse');
      if (!authResponse) return;
      
      try {
        const parsed = JSON.parse(authResponse);
        const token = parsed.accesToken || parsed.accessToken || parsed.token;
        const userData = parsed.user;
        
        if (!userData || !token) return;
        
        // Intentar obtener profile
        let profileData = parsed.profile || parsed.user?.profile;
        
        // Si no hay profile completo, obtenerlo
        if (!profileData?.nickname && userData?.profile?.id) {
          try {
            profileData = await getProfileEndpoint(userData.profile.id);
          } catch (error) {
            console.log('Error obteniendo profile:', error);
          }
        }
        
        // Guardar en Redux
        dispatch(setLogin({
          user: userData,
          profile: profileData,
          token: token
        }));
        
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };
    
    loadUserData();
  }, [dispatch, user, profile]);

 
  return {
    user,
    profile,
    nickname: profile?.nickname || user?.profile?.nickname || "Usuario"
  };
};