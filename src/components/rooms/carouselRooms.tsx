
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import './css/styles.css';

import { useSliderSettings } from '@/lib/hooks/UseslidesToShow';
import { useRandomGradients } from '@/lib/hooks/useRandomGradients';
import { useNotifyToggle } from '@/lib/hooks/useNotifyToggle';
import { 
  useScheduledRooms, 
  scheduledRoomsService 
} from '@/lib/services/rooms/carouselRooms';

interface ScheduledRoomsSliderProps {
  searchQuery?: string;
}

export default function ScheduledRoomsSlider({ 
  searchQuery = '' 
}: ScheduledRoomsSliderProps) {
  const navigate = useNavigate();

  // Hooks
  const { rooms} = useScheduledRooms(searchQuery);
  const settings = useSliderSettings();
  const randomGradients = useRandomGradients(rooms);
  const { getNotifyIcon, toggleNotify } = useNotifyToggle();



  return (
    <Slider 
      {...settings} 
      className={rooms.length === 0 ? 'hidden' : ''}
    >
      {rooms.length > 0 ? (
        rooms.map((item) => {
          const gradientClass = randomGradients[item.id] || '';
          const currentNotifyState = getNotifyIcon(item.id);
          const playerCount = scheduledRoomsService.getPlayerCount(item);

          return (
            <div 
              className={`div-carrusel-item-salas ${gradientClass}`} 
              key={item.id}
            >
              <button 
                className="button-notify-match-dash" 
                onClick={() => toggleNotify(item.id)}
                aria-label="Toggle notification"
              >
                <img 
                  src={`/svg/dashboard/${currentNotifyState}`} 
                  alt="Notification Icon"
                />
              </button>

              <div className="div-info-match-dash">
                <p className="truncate">{item.room_name}</p>
                <p>
                  Jugadores: {' '}
                  <span>
                    <strong>{playerCount}</strong> de{' '}
                    <strong>{item.max_user}</strong>
                  </span>
                </p>
                <p>
                  Preguntas: <span>{item.number_questions} Preguntas</span>
                </p>
                <p>
                  Tiempo de respuesta: <span>{item.time_question} Segundos</span>
                </p>
                <p>
                  Fecha programada: <span>{item.start_date}</span>
                </p>
              </div>

              <div className="gomatch-button-salas">
                <button onClick={() => navigate(`/sala/${item.room_code}`)}>
                  Entrar a la partida
                </button>
              </div>
            </div>
          );
        })
      ) : (
        " "
      )}
    </Slider>
  );
}