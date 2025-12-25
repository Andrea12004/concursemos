import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/waitingroom.css";
// Definición de tipos
interface Profile {
  id: string;
  nickname?: string;
  photoUrl?: string;
}


interface LoaderGameEndResult {
  winner?: Profile;
  scores?: Array<{ profileId: string; score: number }>;
  roomId: string;
}

interface Props {
  onGameEnd?: (result: LoaderGameEndResult) => void;
  roomId?: string;
}

export const Saladeespera: React.FC<Props> = ({ onGameEnd, roomId }) => {
  const navigate = useNavigate();

  // Datos simulados para el perfil del usuario actual
  const currentProfile: Profile = {
    id: "user-current",
    nickname: "Tu Jugador",
    photoUrl: "/images/Logos/Logo-login.png",
  };

  useEffect(() => {
    // Simulación de la lógica de selección aleatoria
    const simulateRandomSelection = () => {
      // Crear jugadores simulados
      const mockProfiles: Profile[] = [
        { id: "player-1", nickname: "Jugador 1" },
        { id: "player-2", nickname: "Jugador 2" },
        { id: "player-3", nickname: "Jugador 3" },
        currentProfile,
      ];

      // Seleccionar un perfil al azar (simulación)
      const randomIndex = Math.floor(Math.random() * mockProfiles.length);
      const randomProfile = mockProfiles[randomIndex];

      console.log(
        `Perfil seleccionado aleatoriamente: ${randomProfile.nickname}`
      );

      // Simular que el perfil actual es el seleccionado (33% de probabilidad para demo)
      const isSelected = Math.random() < 0.33;

      if (isSelected) {
        console.log("¡Eres el seleccionado! Emitiendo endGame...");

        // Simular el evento endGame después de 3 segundos
        setTimeout(() => {
          // Crear un resultado de juego simulado
          const mockGameResult: LoaderGameEndResult = {
            roomId: roomId || "demo-room",
            winner: {
              id: currentProfile.id,
              nickname: currentProfile.nickname,
              photoUrl: currentProfile.photoUrl,
            },
            scores: [
              { profileId: "player-1", score: 150 },
              { profileId: "player-2", score: 120 },
              { profileId: "player-3", score: 95 },
              { profileId: currentProfile.id, score: 180 },
            ],
          };

          // Llamar al callback del padre si existe
          if (onGameEnd) {
            onGameEnd(mockGameResult);
          }

          // Mostrar alerta simulada
          const notification = new Notification("Resultados del Juego", {
            body: `¡${currentProfile.nickname} ha finalizado el juego!`,
            icon: currentProfile.photoUrl,
          });

          notification.onclick = () => {
            console.log("Notificación clickeada");
          };
        }, 3000);
      } else {
        console.log("No eres el seleccionado. Esperando resultados...");

        // Simular que otro jugador finaliza el juego después de 5 segundos
        setTimeout(() => {
          const otherPlayers = mockProfiles.filter(
            (p) => p.id !== currentProfile.id
          );
          const randomWinner =
            otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

          const mockGameResult: LoaderGameEndResult = {
            roomId: roomId || "demo-room",
            winner: randomWinner,
            scores: [
              { profileId: "player-1", score: Math.floor(Math.random() * 200) },
              { profileId: "player-2", score: Math.floor(Math.random() * 200) },
              { profileId: "player-3", score: Math.floor(Math.random() * 200) },
              {
                profileId: currentProfile.id,
                score: Math.floor(Math.random() * 200),
              },
            ].sort((a, b) => b.score - a.score), // Ordenar por puntaje
          };

          if (onGameEnd) {
            onGameEnd(mockGameResult);
          }

          console.log(
            `El juego ha sido finalizado por: ${randomWinner.nickname}`
          );
        }, 5000);
      }
    };

    // Iniciar la simulación después de 2 segundos
    const simulationTimer = setTimeout(simulateRandomSelection, 2000);

    // Temporizador de seguridad por si algo falla (8 segundos máximo)
    const safetyTimer = setTimeout(() => {
      console.log("Temporizador de seguridad: Forzando fin del juego");

      const defaultResult: LoaderGameEndResult = {
        roomId: roomId || "demo-room",
        winner: currentProfile,
        scores: [
          { profileId: currentProfile.id, score: 100 },
          { profileId: "player-1", score: 85 },
          { profileId: "player-2", score: 70 },
        ],
      };

      if (onGameEnd) {
        onGameEnd(defaultResult);
      }
    }, 8000);

    return () => {
      clearTimeout(simulationTimer);
      clearTimeout(safetyTimer);
    };
  }, [onGameEnd, roomId]);

  // Función para navegar al dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

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
        <div className="mt-8">
          <div className="loader">
            <div className="react-star">
              <div className="nucleus"></div>
              <div className="electron electron1"></div>
              <div className="electron electron2"></div>
              <div className="electron electron3"></div>
            </div>
          </div>
        </div>

        {/* Texto principal */}
        <p className="text-esperando">Obteniendo resultados...</p>
      </div>
    </div>
  );
};

export default Saladeespera;
