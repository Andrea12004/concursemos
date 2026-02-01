import { useState } from 'react';
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
  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  // Función principal para ejecutar bloqueo/desbloqueo
  const executeBlock = async (): Promise<void> => {
    setIsLoading(true);

    const userForService = { ...user, blocked };

    await UserService.blockUser({
      user: userForService,
      token,
      onSuccess: () => {
        // Actualizar estado local de forma segura usando la versión funcional
        setBlocked((prev) => {
          const newStatus = !prev;
          setColor(UserService.getBlockIconColor(newStatus));
          return newStatus;
        });

        // Ejecutar callback externo
        if (onSuccess) {
          onSuccess();
        }
      },
      onTokenExpired: logout
    });

    setIsLoading(false);
  };

  // Función para mostrar confirmación
  const confirmBlock = (): void => {
    showConfirm(
      '¿Estás Seguro?',
      `¿Deseas ${action} al usuario ${user.profile?.nickname || user.email}?`,
      confirm,
      () => executeBlock()
    );
  };

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