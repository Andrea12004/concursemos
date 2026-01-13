import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUserEndpoint } from '@/lib/api/users';
import { showConfirm, showAlert } from '@/lib/utils/showAlert';

interface DeleteUserProps {
  id: string | number;
  token: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ id, token }) => {
  const navigate = useNavigate();

  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  // Función para mostrar confirmación
  const confirmDelete = (): void => {
    showConfirm(
      '¿Estás Seguro?',
      '¿Deseas eliminar un usuario?',
      'Eliminar',
      () => deleteUser()
    );
  };

  // Función principal para eliminar
  const deleteUser = async (): Promise<void> => {
    try {
      await deleteUserEndpoint(id, token);
      showAlert(
        'Operación Exitosa',
        'Se ha eliminado el usuario',
        'success'
      ).then(() => {
        location.reload();
      });

    } catch (error: any) {
      // Manejo de errores específicos
      if (error?.response?.data?.message === 'Token expirado') {
        showAlert(
          'Inicio de sesión expirado',
          'Vuelve a ingresar a la plataforma',
          'error'
        ).then(() => {
          logout();
        });
        return;
      }
      
      // Error genérico
      showAlert(
        'Error',
        'Estamos teniendo fallas técnicas',
        'error'
      );
    }
  };


  return (
    <>
      <img 
        src="/svg/usuarios/eliminar.svg" 
        alt="Eliminar" 
        style={{ cursor: "pointer" }} 
        onClick={confirmDelete}
      />
    </>
  );
};

export default DeleteUser;