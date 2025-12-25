import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

interface EliminarusuarioProps {
  id: number;
  token: string;
}

interface DeleteResponse {
  message?: string;

}

const Eliminarusuario: React.FC<EliminarusuarioProps> = ({ id, token }) => {
  const navigate = useNavigate();
  
  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  }

  const confirmDelete = (): void => {
    Swal.fire({
      title: "¿Estas Seguro?",
      text: "¿Deseas eliminar una categoria?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser();
      }
    });
  }

  const deleteUser = async (): Promise<void> => {
    const headers = {
      'cnrsms_token': token,
    };

    try {
      const response = await axios.delete<DeleteResponse>(
        `questions-category/delete/${id}`,
        { headers }
      );
      
      Swal.fire({
        title: 'Operación Exitosa',
        text: `Se ha eliminado la categoria`,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: `Ok`
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error: any) {
      if (error.response?.data?.message === 'Token expirado') {
        Swal.fire({
          title: 'Inicio de sesion expirado',
          text: `Vuelve a ingresar a la plataforma`,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        logout();
        return;
      }
      
      Swal.fire({
        title: 'Error',
        text: `Estamos teniendo fallas tecnicas`,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

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
}

export default Eliminarusuario;