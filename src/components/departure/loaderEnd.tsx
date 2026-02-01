
import "./css/waitingroom.css";
import { useSalaDeEspera } from '@/lib/services/Departure/UseloaderEnd';

interface SaladeesperaProps {
  onGameEnd: (result: any) => void;
  roomId: string;
  roomCode: string;
  profile: any;
}

export const Saladeespera: React.FC<SaladeesperaProps> = ({ 
  onGameEnd, 
  roomId, 
  roomCode, 
  profile 
}) => {
  
  // Usar el hook con la lógica
  useSalaDeEspera(roomId, roomCode, profile, onGameEnd)

  return (
    <div className="div-sala-de-espera">
      <div className="container-esperando">
        {/* Logo */}
         <div className='div-logo-espera cursor-pointer'>
          <img
            src="/images/Logos/Logo-login.png"
            alt="Logo del juego"
          />
        </div>

        {/* Loader animado */}
        
          <div className="loader">
            <div className="react-star">
              <div className="nucleus"></div>
              <div className="electron electron1"></div>
              <div className="electron electron2"></div>
              <div className="electron electron3"></div>
            </div>
          </div>
      

        {/* Texto principal */}
        <p className="text-esperando">Obteniendo resultados...</p>
      </div>
    </div>
  );
};

export default Saladeespera;
