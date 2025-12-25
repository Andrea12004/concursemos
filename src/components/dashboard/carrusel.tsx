import { useEffect, useState } from "react";
import Slider from "react-slick";
import './css/styles.css'

// Tipos
interface Room {
  id: number;
  room_code: string;
  room_name: string;
  max_user: number;
  number_questions: number;
  time_question: number;
  start_date: string | null;
  state: string;
}

interface SimpleSliderProps {
  searchQuery: string;
}

// Datos simulados de rooms
const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    room_code: "ROOM001",
    room_name: "Sala de Trivia General",
    max_user: 10,
    number_questions: 15,
    time_question: 30,
    start_date: null,
    state: "ESPERANDO"
  },
  {
    id: 2,
    room_code: "ROOM002",
    room_name: "Desafío de Matemáticas",
    max_user: 8,
    number_questions: 20,
    time_question: 45,
    start_date: null,
    state: "ESPERANDO"
  },
  {
    id: 3,
    room_code: "ROOM003",
    room_name: "Historia Mundial",
    max_user: 12,
    number_questions: 10,
    time_question: 25,
    start_date: null,
    state: "ESPERANDO"
  },
  {
    id: 4,
    room_code: "ROOM004",
    room_name: "Ciencia y Tecnología",
    max_user: 15,
    number_questions: 18,
    time_question: 35,
    start_date: null,
    state: "ESPERANDO"
  },
  {
    id: 5,
    room_code: "ROOM005",
    room_name: "Cultura Pop",
    max_user: 20,
    number_questions: 25,
    time_question: 20,
    start_date: null,
    state: "ESPERANDO"
  },
  {
    id: 6,
    room_code: "ROOM006",
    room_name: "Geografía Avanzada",
    max_user: 10,
    number_questions: 12,
    time_question: 40,
    start_date: null,
    state: "ESPERANDO"
  }
];

export default function SimpleSlider({ searchQuery }: SimpleSliderProps) {
  const [randomGradients, setRandomGradients] = useState<Record<number, string>>({});
  const [pathnotify, setPath] = useState<string>('notify.svg');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});

  // Filtrar rooms por el searchQuery
  const filteredRooms = rooms.filter(room => 
    room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simular conteo de jugadores conectados
  useEffect(() => {
    const counts: Record<string, number> = {};
    filteredRooms.forEach((room) => {
      // Generar un número aleatorio de jugadores conectados (entre 0 y max_user)
      counts[room.room_code] = Math.floor(Math.random() * (room.max_user + 1));
    });
    setConnectedCounts(counts);
  }, [filteredRooms.length]);

  // Estado para almacenar las configuraciones del slider
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
  });

  // Función para actualizar la configuración según el tamaño de la ventana
  const updateSliderSettings = () => {
    if (window.innerWidth <= 767) {
      setSettings(prevSettings => ({
        ...prevSettings,
        slidesToShow: 1,
      }));
    } else {
      setSettings(prevSettings => ({
        ...prevSettings,
        slidesToShow: 3,
      }));
    }
  };

  // Ejecutar la función cada vez que se cambia el tamaño de la ventana
  useEffect(() => {
    updateSliderSettings();
    window.addEventListener('resize', updateSliderSettings);

    return () => {
      window.removeEventListener('resize', updateSliderSettings);
    };
  }, []);

  // Función para cambiar la imagen de notificación
  const notify = () => {
    if (pathnotify === 'notify.svg') {
      setPath('notifyselected.svg');
    } else {
      setPath('notify.svg');
    }
  };

  // Lista de gradientes
  const gradients: string[] = [
    "gradient-blue",
    "gradient-purple",
    "gradient-green",
  ];

  // Cargar datos simulados al montar el componente
  useEffect(() => {
    // Simular carga de datos (como si viniera de una API)
    setTimeout(() => {
      setRooms(MOCK_ROOMS);
    }, 500);
  }, []);

  // Obtener gradiente aleatorio para cada categoría cuando las categorías cambian
  useEffect(() => {
    const newGradients: Record<number, string> = {};
    if (rooms.length > 0) {
      rooms.forEach((item) => {
        const randomIndex = Math.floor(Math.random() * gradients.length);
        newGradients[item.id] = gradients[randomIndex];
      });
    }
    setRandomGradients(newGradients);
  }, [rooms]);

  const goMatch = (roomCode: string) => {
    // Simular navegación
    console.log(`Navegando a sala: ${roomCode}`);
    alert(`Entrando a la sala: ${roomCode}`);
  };

  return (
    <Slider {...settings}>
      {filteredRooms.length > 0 ? (
        filteredRooms.map((item) => {
          const gradientClass = randomGradients[item.id] || "";
          const numberPersons = connectedCounts[item.room_code] || 0;

          return (
            <div className={`div-carrusel-item ${gradientClass}`} key={item.id}>
              <div className="div-info-match-dash">
                <p className="truncate">{item.room_name}</p>
                <p>Jugadores: <span>{numberPersons} de {item.max_user}</span></p>
                <p>Preguntas: <span>{item.number_questions} Preguntas</span></p>
                <p>Tiempo de respuesta: <span>{item.time_question} Segundos</span></p>
              </div>
              <div className="gomatch-button">
                <button onClick={() => goMatch(item.room_code)}>Entrar a la partida</button>
              </div>
            </div>
          );
        }).slice(0, 27)
      ) : (
        <div className="no-rooms">No hay salas disponibles</div>
      )}
    </Slider>
  );
}