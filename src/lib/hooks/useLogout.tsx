// src/lib/hooks/useLogout.tsx
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogout } from '@/lib/store/authSlice';
import { socketManager } from '@/settings/socket';

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    console.log('👋 Cerrando sesión...');
    
    // 1. Limpiar Redux
    dispatch(setLogout());
    
    // 2. Limpiar localStorage
    localStorage.clear(); // Limpia TODO
    
    // 3. Desconectar socket
    socketManager.disconnect();
    
    // 4. Redirigir
    navigate("/", { replace: true });
  };

  return { logout };
};