// components/RoomsSlider.tsx
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { useRooms } from '@/lib/services/Dashboard/carousel';
import { useSliderSettings } from '@/lib/hooks/UseslidesToShow';
import { useRandomGradients } from '@/lib/hooks/useRandomGradients';

interface RoomsSliderProps {
  searchQuery?: string;
}

export default function RoomsSlider({ searchQuery = '' }: RoomsSliderProps) {
  const navigate = useNavigate();
  
  // 1. Obtener salas y jugadores conectados (con Socket.IO)
  const { rooms, connectedCounts, loading } = useRooms(searchQuery);
  
  // 2. Configuración responsive del slider
  const settings = useSliderSettings();
  
  // 3. Gradientes aleatorios para cada sala
  const randomGradients = useRandomGradients(rooms);

  const goMatch = (roomCode: string) => {
    navigate(`/sala/${roomCode}`);
  };

  if (loading) {
    return <div>Cargando salas...</div>;
  }

  return (
    <Slider {...settings}>
      {rooms.length > 0 ? (
        rooms.slice(0, 27).map((item) => {
          const gradientClass = randomGradients[item.id] || "";
          const numberPersons = connectedCounts[item.room_code] || 0;

          return (
            <div className={`div-carrusel-item ${gradientClass}`} key={item.id}>
              <div className="div-info-match-dash">
                <p className="truncate">{item.room_name}</p>
                <p>
                  Jugadores: <span>{numberPersons} de {item.max_user}</span>
                </p>
                <p>
                  Preguntas: <span>{item.number_questions} Preguntas</span>
                </p>
                <p>
                  Tiempo de respuesta: <span>{item.time_question} Segundos</span>
                </p>
              </div>
              <div className="gomatch-button">
                <button onClick={() => goMatch(item.room_code)}>
                  Entrar a la partida
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-rooms">No hay salas disponibles</div>
      )}
    </Slider>
  );
}