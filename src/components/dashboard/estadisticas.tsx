import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './css/styles.css';

interface UserProfile {
  id?: number;
  level?: string;
  correct_answers?: number;
  Total_points?: number;
}

interface UserData {
  profile?: UserProfile;
}

export function Estadisticas() {
  /* Estado para datos mock (simulación) */
  const [user, setUser] = useState<UserData>({});
  
  /* Función mock para simular la obtención de datos */
  const getMockUserData = () => {
    // Datos de ejemplo para la maquetación
    const mockUser: UserData = {
      profile: {
        id: 1,
        level: "PESCADO",
        correct_answers: 150,
        Total_points: 1250
      }
    };
    return mockUser;
  };

  useEffect(() => {
    // Simulamos la carga de datos después de un breve retraso
    const timer = setTimeout(() => {
      const mockData = getMockUserData();
      setUser(mockData);
    }, 500); // Pequeño delay para simular carga
    
    return () => clearTimeout(timer);
  }, []);

   return <div className='div-stats'>
                    <div className='header-stats'>
                        <p>Tus estadísticas</p>
                        <Link to="/perfil"><img src="/svg/dashboard/gobutton.svg" alt="" /></Link>
                    </div>
                    <div className='stats'>
                        <div className='stats-level'>
                            <p className='stats-title'>Nivel</p>
                                <img src={user && user.profile ? `/images/Niveles/${user.profile.level}.png` : ''} alt="" />
                            <p className='stats-description'>{user && user.profile ? user.profile.level : 'Cargando...'}</p>
                        </div>
                        <div className='div-puntos-respuestas'>
                            <div className='div-preguntas-stats'>
                                <img src="/svg/dashboard/preguntas-resueltas.svg" alt="" />
                                <p>{user && user.profile ? user.profile.correct_answers : 'Cargando...'}<br />Preguntas<br />Resueltas</p>
                            </div>
                            <div className='div-puntos-stats'>
                                <img src="/svg/dashboard/logrostats.svg" alt="" />
                                <p>{user && user.profile ? user.profile.Total_points : 'Cargando...'}<br />Puntos<br />Acomulados</p>
                            </div>
                        </div>
                    </div>
                </div>;
}

export default Estadisticas;