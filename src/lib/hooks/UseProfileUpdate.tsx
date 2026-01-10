// hooks/useProfileUpdate.ts
import { useAppDispatch } from '@/lib/store/hooks';
import { setProfile } from '@/lib/store/authSlice';
import { getProfileEndpoint } from '@/lib/api/profile';

export const useProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const updateProfile = async (userId: string) => {
    try {
      // 1. Obtener perfil actualizado del backend
      const updatedProfile = await getProfileEndpoint(userId);
      
      // 2. Actualizar Redux
      dispatch(setProfile(updatedProfile));
      
      // 3. Actualizar localStorage
      const authResponse = JSON.parse(
        localStorage.getItem('authResponse') || '{}'
      );
      authResponse.profile = updatedProfile;
      localStorage.setItem('authResponse', JSON.stringify(authResponse));
      
      return updatedProfile;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  };

  return { updateProfile };
};