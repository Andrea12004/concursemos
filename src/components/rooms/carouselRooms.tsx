import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "./css/styles.css";


interface Profile {
  id: string;
  name: string;
  // Agrega otros campos según sea necesario
}

interface Room {
  id: string;
  room_name: string;
  room_code: string;
  start_date: string;
  state: string;
  max_user: number;
  number_questions: number;
  time_question: number;
  invitedProfiles: Profile[];
}

interface SimpleSliderProps {
  searchQuery: string;
}

interface NotifyState {
  [key: string]: string;
}

interface RandomGradients {
  [key: string]: string;
}

export default function SimpleSlider({ searchQuery }: SimpleSliderProps) {
  const navigate = useNavigate();

  // Datos mock para las salas
  const mockRooms: Room[] = [
    {
      id: "1",
      room_name: "Sala de Geografía Avanzada",
      room_code: "GEO123",
      start_date: "2024-12-15 20:00:00",
      state: "ESPERANDO",
      max_user: 8,
      number_questions: 15,
      time_question: 30,
      invitedProfiles: [
        { id: "2", name: "Juan Pérez" },
        { id: "3", name: "María García" },
        { id: "4", name: "Carlos López" }
      ]
    },
    {
      id: "2",
      room_name: "Sala de Historia Mundial",
      room_code: "HIST456",
      start_date: "2024-12-16 18:30:00",
      state: "ESPERANDO",
      max_user: 6,
      number_questions: 20,
      time_question: 25,
      invitedProfiles: [
        { id: "5", name: "Ana Martínez" },
        { id: "6", name: "Pedro Sánchez" }
      ]
    }
  ];

  // Cerrar sesión por token expirado
  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const [randomGradients, setRandomGradients] = useState<RandomGradients>({});
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>(mockRooms); // Usamos los datos mock
  const [notifyState, setNotifyState] = useState<NotifyState>({}); // State to track notify for each room

  // Configuración del slider
  interface SliderSettings {
    dots: boolean;
    infinite: boolean;
    autoplay: boolean;
    speed: number;
    autoplaySpeed: number;
    slidesToShow: number;
    slidesToScroll: number;
  }

  // Estado para almacenar las configuraciones del slider
  const [settings, setSettings] = useState<SliderSettings>({
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    slidesToShow: 3, // valor predeterminado para pantallas grandes
    slidesToScroll: 1,
  });

  // Función para actualizar la configuración según el tamaño de la ventana
  const updateSliderSettings = () => {
    if (window.innerWidth <= 767) {  // Si el tamaño de la ventana es menor o igual a 767px
      setSettings(prevSettings => ({
        ...prevSettings,
        slidesToShow: 1, // En móviles mostrar solo 1 slide
      }));
    } else {
      setSettings(prevSettings => ({
        ...prevSettings,
        slidesToShow: 3, // En pantallas grandes mostrar 3 slides
      }));
    }
  };

  // Ejecutar la función cada vez que se cambia el tamaño de la ventana
  useEffect(() => {
    updateSliderSettings(); // Al cargar el componente
    window.addEventListener('resize', updateSliderSettings); // Al cambiar el tamaño de la ventana

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', updateSliderSettings);
    };
  }, []);

  // Función para cambiar la imagen de notificación
  const notify = (roomId: string) => {
    setNotifyState(prevState => {
      const newState = { ...prevState };
      // Toggle the state of the notify button for the clicked room
      newState[roomId] = newState[roomId] === 'notify.svg' ? 'notifyselected.svg' : 'notify.svg';
      return newState;
    });
  };

  // Lista de gradientes
  const gradients = [
    "gradient-blue",
    "gradient-purple",
    "gradient-green",
  ];

  // Traer el objeto user del localStorage
  useEffect(() => {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      try {
        const parsedResponse = JSON.parse(authResponse);
        setToken(parsedResponse.accesToken || '');
        setUserID(parsedResponse.user?.profile?.id || '');
      } catch (error) {
        console.error("Error parsing authResponse:", error);
      }
    }
  }, []);

  // Obtener gradiente aleatorio para cada sala cuando las salas cambian
  useEffect(() => {
    // Asignar gradientes aleatorios solo cuando se obtienen las salas
    const newGradients: RandomGradients = {};
    if (rooms.length > 0) {
      rooms.forEach((item) => {
        const randomIndex = Math.floor(Math.random() * gradients.length);
        newGradients[item.id] = gradients[randomIndex]; // Asignar un gradiente aleatorio a cada sala
      });
    }
    setRandomGradients(newGradients); // Actualizar el estado con los gradientes
  }, [rooms]);  // Solo se ejecuta cuando las salas cambian

  useEffect(() => {
    if (token) {
      // En esta versión mock, no necesitamos hacer la llamada API
      // Pero mantenemos la estructura para futura implementación
      console.log("Token disponible:", token);
    }
  }, [token]);

  // Obtener salas (versión mock)
  const getRooms = async () => {
    // En lugar de hacer una llamada API, usamos los datos mock
    // Filtramos solo las salas que tienen start_date diferente a null
    const filteredRooms = mockRooms.filter(room => 
      room.start_date !== null && 
      room.state !== 'FINALIZADA' && 
      room.state !== 'JUGANDO'
    );
    
    // Guardamos las salas filtradas
    setRooms(filteredRooms);
    
    // Simulamos un pequeño retardo como si fuera una llamada real
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(filteredRooms);
      }, 100);
    });
  };

  // Filtrar rooms por el searchQuery
  const filteredRooms = rooms.filter(room => 
    room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goMatch = (roomCode: string) => {
    navigate(`/sala/${roomCode}`);
  }

  return (
    <Slider {...settings} className={filteredRooms.length === 0 ? 'hidden' : ''}>
      {filteredRooms.length > 0 ? (
        filteredRooms.map((item) => {
          const gradientClass = randomGradients[item.id] || ""; // Obtener el gradiente asignado
          const currentNotifyState = notifyState[item.id] || 'notify.svg'; // Get the current notify state for the room

          return (
            <div className={`div-carrusel-item-salas ${gradientClass}`} key={item.id}>
              <button 
                className="button-notify-match-dash" 
                onClick={() => notify(item.id)}
                aria-label="Toggle notification"
              >
                  <img 
                    src={`/svg/dashboard/${currentNotifyState}`} 
                    alt={currentNotifyState === 'notify.svg' ? "Notificar" : "Notificación activa"} 
                  />
              </button>
              <div className="div-info-match-dash">
                  <p className="truncate">{item.room_name}</p>
                  <p>Jugadores: 
                    <span>
                      <strong>{item.invitedProfiles.length + 1}</strong> de <strong>{item.max_user}</strong>
                    </span>
                  </p>
                  <p>Preguntas: <span>{item.number_questions} Preguntas</span></p>
                  <p>Tiempo de respuesta: <span>{item.time_question} Segundos</span></p>
                  <p>Fecha programada: <span>{item.start_date}</span></p>
              </div>
              <div className="gomatch-button-salas">
                <button onClick={() => goMatch(item.room_code)}>
                  Entrar a la partida
                </button>
              </div>
            </div> 
          );
        })
      ) : (
        <div className="no-rooms-message">
          {searchQuery ? `No se encontraron salas con "${searchQuery}"` : "No hay salas disponibles"}
        </div>
      )}
    </Slider>
  );
}