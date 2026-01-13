import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '@/lib/services/Users/userService';
import { showConfirm } from '@/lib/utils/showAlert';
import type { User } from '@/lib/types/user';

interface UseBlockUserProps {
  user: User;
  token: string;
  onSuccess?: () => void;
}

export const useBlockUser = ({ user, token, onSuccess }: UseBlockUserProps) => {
  const navigate = useNavigate();
  
  // Estados
  const [blocked, setBlocked] = useState<boolean>(!!user.blocked);
  const [color, setColor] = useState<string>(UserService.getBlockIconColor(!!user.blocked));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Textos dinámicos
  const { action, confirm, past } = UserService.getBlockActionText(blocked);

  // Función de logout
  const logout = useCallback((): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  }, [navigate]);

  // Función para mostrar confirmación
  const confirmBlock = useCallback((): void => {
    showConfirm(
      '¿Estás Seguro?',
      `¿Deseas ${action} al usuario ${user.profile?.nickname || user.email}?`,
      confirm,
      () => executeBlock()
    );
  }, [action, confirm, user]);

  // Función principal para ejecutar bloqueo/desbloqueo
  const executeBlock = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    const success = await UserService.blockUser({
      user,
      token,
      onSuccess: () => {
        // Actualizar estado local
        const newStatus = !blocked;
        setBlocked(newStatus);
        setColor(UserService.getBlockIconColor(newStatus));
        
        // Ejecutar callback externo
        if (onSuccess) {
          onSuccess();
        }
      },
      onTokenExpired: logout
    });
    
    setIsLoading(false);
  }, [user, token, blocked, onSuccess, logout]);

  return {
    // Estados
    blocked,
    color,
    isLoading,
    
    // Funciones
    confirmBlock,
    
    // Datos auxiliares
    actionText: action,
    confirmText: confirm,
    pastText: past
  };
};