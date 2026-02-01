import { useEstadisticasPerfilLogic } from "@/lib/services/Profile/useStatistical";
import './css/styles.css'

export const Estadisticasperfil = () => {
  const {  userStats } = useEstadisticasPerfilLogic();

  return (
    <>
      <div className='stats-perfil'>
        <div className='stats-level-perfil'>
          <p className='stats-title-perfil'>Nivel</p>
          <img 
            src={userStats?.profile?.level 
              ? `/images/niveles/${userStats.profile.level}.png` 
              : '/images/niveles/default.png'
            } 
            alt="Nivel" 
          />
          <p className='stats-description-perfil'>
            {userStats?.profile?.level || 'Cargando...'}
          </p>
        </div>
        
        <div className='div-puntos-respuestas-perfil'>
          <div className='div-preguntas-stats-perfil'>
            <img src="/svg/perfil/preguntas-perfil.svg" alt="Preguntas" />
            <p>
              {userStats?.profile?.correct_answers ?? 'Cargando...'} 
              <br /> Preguntas <br />Resueltas
            </p>
          </div>
          
          <div className='div-puntos-stats-perfil'>
            <img src="/svg/perfil/puntos-perfil.svg" alt="Puntos" />
            <p>
              {userStats?.profile?.Total_points ?? 'Cargando...'}
              <br />Puntos <br />Acumulados
            </p>
          </div>
          
          <div className='div-puntos-stats-perfil'>
            <img src="/svg/perfil/salas-ganas.svg" alt="Salas ganadas" />
            <p>
              {userStats?.profile?.Rooms_win ?? 'Cargando...'}
              <br />Salas <br />Ganadas
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Estadisticasperfil;