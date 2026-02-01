import React from 'react';
import { useLogout } from '@/lib/hooks/useLogout';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { showAlert, showConfirm } from '@/lib/utils/showAlert';
import { deleteQuestionCategoryEndpoint } from '@/lib/api/Questions';

interface EliminarCategoriaProps {
  id: string | number;
  token: string;
  onDeleted?: () => void;
}

export const EliminarCategoria: React.FC<EliminarCategoriaProps> = ({ 
  id, 
  token,
  onDeleted 
}) => {

  const { logout } = useLogout();

  const confirmDelete = () => {
    showConfirm(
      '¿Estás Seguro?',
      '¿Deseas eliminar esta categoría?',
      'Eliminar',
      deleteCategory
    );
  };

  const deleteCategory = async () => {
    try {
      await deleteQuestionCategoryEndpoint(id, token);

      showAlert(
        'Operación Exitosa',
        'Se ha eliminado la categoría',
        'success'
      ).then(() => {
        if (onDeleted) {
          onDeleted(); // Llamar callback si existe
        } else {
          location.reload(); // Fallback a reload
        }
      });
    } catch (error) {
      handleAxiosError(error, logout);
    }
  };

  return (
    <>
      <img 
        src="/svg/iconos/eliminar-blanco.svg" 
        alt="Eliminar" 
        className='absolute top-4 right-4 z-20' 
        style={{ cursor: "pointer" }} 
        onClick={confirmDelete}
      />
    </>
  );
};

export default EliminarCategoria;