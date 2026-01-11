// src/lib/hooks/useLogout.tsx - COMPLETO
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogout } from '@/lib/store/authSlice';
import { socketManager } from '@/settings/socket';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    console.log('👋 Cerrando sesión...');
    
    try {
      // 1. Desconectar socket primero
      socketManager.disconnect();
      console.log('✅ Socket desconectado');
      
      // 2. Limpiar Redux
      dispatch(setLogout());
      console.log('✅ Redux limpiado');
      
      // 3. Limpiar localStorage
      localStorage.clear();
      console.log('✅ LocalStorage limpiado');
      
      // 4. Redirigir
      navigate("/", { replace: true });
      console.log('✅ Redirigido al login');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      // Aún así intentar redirigir
      navigate("/", { replace: true });
    }
  };

  return { logout };
};