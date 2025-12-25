import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/styles.css'

// Definición de tipos
interface UserProfile {
  id: number;
  profile: {
    id: number;
    level: string;
    correct_answers: number;
    Total_points: number;
    Rooms_win: number;
  };
}

interface AuthResponse {
  accesToken: string;
  user: {
    id: number;
    profile: {
      id: number;
    };
  };
}

export const Estadisticasperfil: React.FC = () => {
  /*Cerrar Sesion por token expirado*/
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  }

  /*traer el objeto user del localstorage*/
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<number | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Datos simulados para desarrollo
  const mockUserProfile: UserProfile = {
    id: 1,
    profile: {
      id: 101,
      level: "PESCADO",
      correct_answers: 284,
      Total_points: 12500,
      Rooms_win: 42
    }
  };

  useEffect(() => {
    // Simular datos de autenticación
    const mockAuthResponse: AuthResponse = {
      accesToken: "mock-token-12345",
      user: {
        id: 1,
        profile: {
          id: 101
        }
      }
    };
    
    // Guardar en localStorage para simular
    localStorage.setItem("authResponse", JSON.stringify(mockAuthResponse));
    
    // Obtener datos del localStorage
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}') as AuthResponse;
    
    if (authResponse.accesToken) {
      setToken(authResponse.accesToken);
      setUserID(authResponse.user.profile.id);
    }
  }, []);

  const getUsers = async (): Promise<void> => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Usar datos simulados
      setUser(mockUserProfile);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Estamos teniendo fallas técnicas',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };

  useEffect(() => {
    if (token) {
      getUsers();
    }
    
    // También cargar datos si no hay token (para desarrollo)
    if (!token) {
      setUser(mockUserProfile);
    }
  }, [token]);

  return (
    <>
      <div className='stats-perfil'>
        <div className='stats-level-perfil'>
          <p className='stats-title-perfil'>Nivel</p>
          <img src={user && user.profile ? `/images/Niveles/${user.profile.level}.png` : ''} alt="" />
          <p className='stats-description-perfil'>{user && user.profile ? user.profile.level : 'Cargando...'}</p>
        </div>
        <div className='div-puntos-respuestas-perfil'>
          <div className='div-preguntas-stats-perfil'>
            <img src="/svg/perfil/preguntas-perfil.svg" alt="" />
            <p>{user && user.profile ? user.profile.correct_answers : 'Cargando...'} <br /> Preguntas <br />Resueltas</p>
          </div>
          <div className='div-puntos-stats-perfil'>
            <img src="/svg/perfil/puntos-perfil.svg" alt="" />
            <p>{user && user.profile ? user.profile.Total_points : 'Cargando...'}<br />Puntos <br />Acomulados</p>
          </div>
          <div className='div-puntos-stats-perfil'>
            <img src="/svg/perfil/salas-ganas.svg" alt="" />
            <p>{user && user.profile ? user.profile.Rooms_win : 'Cargando...'}<br />Salas <br />Ganadas</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Estadisticasperfil;