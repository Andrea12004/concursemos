import React from 'react';
import { deleteUserEndpoint } from '@/lib/api/users';
import { showConfirm, showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';

interface DeleteUserProps {
  id: string | number;
  token: string;
  onSuccess?: () => void; // Callback para actualizar lista
}

const DeleteUser: React.FC<DeleteUserProps> = ({ id, token, onSuccess }) => {
  const { logout } = useLogout(); 
  // Función para mostrar confirmación
  const confirmDelete = (): void => {
    showConfirm(
      '¿Estás Seguro?',
      'Esta acción no se puede deshacer',
      'Eliminar',
      deleteUser
    );
  };

  // Función principal para eliminar
  const deleteUser = async (): Promise<void> => {
    try {
      await deleteUserEndpoint(id, token);
      
      await showAlert(
        'Éxito',
        'Usuario eliminado correctamente',
        'success'
      );

      // Actualizar lista sin recargar página
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);

      // Manejo de errores específicos
      if (error?.response?.data?.message === 'Token expirado' ||
          error?.response?.status === 401) {
        await showAlert(
          'Sesión Expirada',
          'Por favor, inicia sesión nuevamente',
          'error'
        );
        logout();
        return;
      }
      
      // Error genérico
      showAlert(
        'Error',
        'No se pudo eliminar el usuario. Intenta de nuevo.',
        'error'
      );
    }
  };

  return (
    <img 
      src="/svg/usuarios/eliminar.svg" 
      alt="Eliminar usuario" 
      style={{ cursor: "pointer" }} 
      onClick={confirmDelete}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          confirmDelete();
        }
      }}
    />
  );
};

export default DeleteUser;