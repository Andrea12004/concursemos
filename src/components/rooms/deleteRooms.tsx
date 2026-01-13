
import './css/styles.css'
import React from 'react';
import { deleteRoomEndpoint } from '@/lib/api/rooms';
import { showAlert, showConfirm } from '@/lib/utils/showAlert';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';

interface DeleteRoomProps {
  id: string;
  token: string;
}

export const DeleteRoom: React.FC<DeleteRoomProps> = ({ id, token }) => {
  const { logout } = useLogout();

  /**
   * Confirmar antes de eliminar
   */
  const confirmDelete = () => {
    showConfirm(
      '¿Estás Seguro?',
      '¿Deseas eliminar esta sala?',
      'Eliminar',
      deleteRoom
    );
  };

  /**
   * Eliminar sala
   */
  const deleteRoom = async () => {
    try {
      await deleteRoomEndpoint(token, id);

      showAlert(
        'Operación Exitosa',
        'Se ha eliminado la sala',
        'success'
      ).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });

    } catch (error) {
      handleAxiosError(error, logout);
    }
  };

  return (
    <img
      src="/svg/iconos/eliminar-blanco.svg"
      alt="Eliminar"
      className="!border-0 w-[16px] h-[19px] ml-4"
      style={{ cursor: 'pointer' }}
      onClick={confirmDelete}
    />
  );
};

export default DeleteRoom;