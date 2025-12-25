import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

/* Props tipadas */
interface EliminarUsuarioProps {
  id: string | number;
  token?: string; // opcional por ahora (maqueta)
}

const Eliminarusuario: React.FC<EliminarUsuarioProps> = ({ id }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('authResponse');
    navigate('/');
  };

  const confirmDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas eliminar un usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser();
      }
    });
  };

  /* MAQUETA: simulación de eliminación */
  const deleteUser = () => {
    console.log('Usuario eliminado (maqueta):', id);

    Swal.fire({
      title: 'Operación Exitosa',
      text: 'Se ha eliminado el usuario (maqueta)',
      icon: 'success',
      confirmButtonColor: '#25293d',
      confirmButtonText: 'Ok',
    }).then(() => {
      // Simulación de refresco
      window.location.reload();
    });
  };

  return (
    <>
      <img
        src="/svg/usuarios/eliminar.svg"
        alt="Eliminar"
        style={{ cursor: 'pointer' }}
        onClick={confirmDelete}
      />
    </>
  );
};

export default Eliminarusuario;
