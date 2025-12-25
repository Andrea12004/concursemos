import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/styles.css'
// import axios from 'axios';

interface EliminarUsuarioProps {
  id: string | number;
  token: string;
}

export const EliminarUsuario: React.FC<EliminarUsuarioProps> = ({ id }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "¿Estás Seguro?",
      text: "¿Deseas eliminar una sala?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser();
      }
    });
  };

  const deleteUser = async () => {
    // const headers = {
    //   'cnrsms_token': token,
    // };

    try {
      // const response = await axios.delete(`/rooms/${id}`, { headers });

      // Simulación de eliminación exitosa
      Swal.fire({
        title: 'Operación Exitosa',
        text: 'Se ha eliminado la sala (simulación)',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error: any) {
      console.error('Error al eliminar:', error);

      if (error.response?.data?.message === 'Token expirado') {
        Swal.fire({
          title: 'Inicio de sesion expirado',
          text: 'Vuelve a ingresar a la plataforma',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        logout();
        return;
      }

      Swal.fire({
        title: 'Error',
        text: 'Estamos teniendo fallas tecnicas',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

 return (
  <>
  <div className="btn-eliminar-sala" onClick={confirmDelete}>
  <img 
    src="/svg/iconos/eliminar-blanco.svg" 
    alt="Eliminar" 
  />
</div>

  </>
);
};

export default EliminarUsuario;