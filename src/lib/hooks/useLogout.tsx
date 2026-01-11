// src/lib/hooks/useLogout.tsx - CON DESCONEXIÓN DE SOCKET
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogout } from '@/lib/store/authSlice';
import { disconnectSocket } from '@/settings/socket'; // ⭐ Helper para desconectar

/**
 * Hook useLogout - Cierra sesión y limpia todo
 * 
 * Incluye:
 * - Desconexión del socket
 * - Limpieza de Redux
 * - Limpieza de localStorage
 * - Redirección al login
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    console.log('👋 Cerrando sesión...');
    
    try {
      // 1. Desconectar socket PRIMERO
      console.log('🔌 Desconectando socket...');
      disconnectSocket();
      console.log('✅ Socket desconectado');
      
      // 2. Limpiar Redux
      console.log('🗑️ Limpiando Redux...');
      dispatch(setLogout());
      console.log('✅ Redux limpiado');
      
      // 3. Limpiar localStorage
      console.log('🗑️ Limpiando localStorage...');
      localStorage.clear();
      console.log('✅ LocalStorage limpiado');
      
      // 4. Redirigir
      console.log('➡️ Redirigiendo al login...');
      navigate("/", { replace: true });
      console.log('✅ Logout completado');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
      // Aún así intentar redirigir
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  return { logout };
};