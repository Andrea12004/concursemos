import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogout } from '@/lib/store/authSlice';
import { disconnectSocket } from '@/settings/socket'; // ⭐

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    console.log('👋 Cerrando sesión...');
    
    try {
      // 1. Desconectar socket PRIMERO
      disconnectSocket();
      
      // 2. Limpiar Redux
      dispatch(setLogout());
      
      // 3. Limpiar localStorage
      localStorage.clear();
      
      // 4. Redirigir
      navigate("/", { replace: true });
    } catch (error) {
      console.error('❌ Error en logout:', error);
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  return { logout };
};