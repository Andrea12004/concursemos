import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./css/listplayers.css";
import type {
  Player,
  PlayerScoreLocal,
  Profile,
  User,
  ListaJugadoresProps as Props,
} from '@/lib/types/lista-jugadores';


export const ListaJugadores: React.FC<Props> = ({
  timeup = false,
  setFinal,
}) => {
  const { id: roomId } = useParams<{ id: string }>();
  const [token, setToken] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  // Cargar los datos del localStorage (simulado para maqueta)
  useEffect(() => {
    // Crear datos de usuario de ejemplo para la maqueta
    const mockProfile: Profile = {
      id: "user-123",
      nickname: "TuJugador",
      photoUrl: "/images/Logos/Logo-login.png",
    };

    const mockUser: User = {
      id: "user-123",
      profile: mockProfile,
    };

    setProfile(mockProfile);
    setUser(mockUser);
    setToken("mock-token-for-demo");

    // Inicializar con jugadores de ejemplo para la maqueta
    const initialPlayers: Player[] = [
      {
        id: "player-1",
        profileId: "player-1",
        nickname: "Jugador1",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jugador1",
        score: 150,
        pointsAwarded: 150,
        correct_answers: 8,
      },
      {
        id: "player-2",
        profileId: "player-2",
        nickname: "Jugador2",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jugador2",
        score: 120,
        pointsAwarded: 120,
        correct_answers: 6,
      },
      {
        id: "player-3",
        profileId: "player-3",
        nickname: "Jugador3",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jugador3",
        score: 95,
        pointsAwarded: 95,
        correct_answers: 5,
      },
    ];

    setPlayers(initialPlayers);

    // Si existe setFinal, pasar los jugadores iniciales mapeados a PlayerScoreLocal
    if (setFinal) {
      const mappedInitial: PlayerScoreLocal[] = initialPlayers.map((p) => ({
        id: p.profileId || p.id,
        nickname: p.nickname,
        totalScore: p.score || 0,
        photoUrl: p.photoUrl,
      }));
      setFinal(mappedInitial);
    }
  }, []);

  // Simular actualización cuando timeup cambia a true
  useEffect(() => {
    if (timeup) {
      // Simular una actualización de puntos después del tiempo
      const updatedPlayers = players.map((player) => ({
        ...player,
        // Incrementar puntos aleatoriamente para la simulación
        score: player.score
          ? player.score + Math.floor(Math.random() * 50)
          : Math.floor(Math.random() * 200),
        pointsAwarded: player.pointsAwarded
          ? player.pointsAwarded + Math.floor(Math.random() * 50)
          : Math.floor(Math.random() * 200),
        correct_answers: player.correct_answers
          ? player.correct_answers + Math.floor(Math.random() * 3)
          : Math.floor(Math.random() * 10),
      }));

      // Ordenar por puntos de mayor a menor
      const sortedPlayers = [...updatedPlayers].sort((a: Player, b: Player) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
      });

      setPlayers(sortedPlayers);

      // Pasar los resultados finales si existe setFinal (mapeando a PlayerScoreLocal)
      if (setFinal) {
        const mappedFinal: PlayerScoreLocal[] = sortedPlayers.map((p) => ({
          id: p.profileId || p.id,
          nickname: p.nickname,
          totalScore: p.score || 0,
          photoUrl: p.photoUrl,
        }));
        setFinal(mappedFinal);
      }

      // Mostrar mensaje de consola para depuración
      console.log("Tiempo finalizado! Puntos actualizados:", sortedPlayers);
    }
  }, [timeup, setFinal]);

  // Simular la llegada y salida de jugadores
  useEffect(() => {
    // Simular que un jugador nuevo se une cada 15 segundos (solo en modo demo)
    const joinInterval = setInterval(() => {
      if (players.length < 6) {
        // Máximo 6 jugadores para la demo
        const newPlayer: Player = {
          id: `player-new-${Date.now()}`,
          profileId: `player-new-${Date.now()}`,
          nickname: `Jugador${players.length + 1}`,
          photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Jugador${
            players.length + 1
          }`,
          score: Math.floor(Math.random() * 100),
          pointsAwarded: Math.floor(Math.random() * 100),
          correct_answers: Math.floor(Math.random() * 5),
        };

        setPlayers((prev) => [...prev, newPlayer]);
        console.log(`Nuevo jugador: ${newPlayer.nickname}`);
      }
    }, 15000);

    // Simular que un jugador abandona cada 25 segundos
    const leaveInterval = setInterval(() => {
      if (players.length > 1) {
        // Mantener al menos un jugador
        // Seleccionar un jugador aleatorio (que no sea el usuario actual)
        const playersToRemove = players.filter((p) => p.id !== profile?.id);
        if (playersToRemove.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * playersToRemove.length
          );
          const playerToRemove = playersToRemove[randomIndex];

          setPlayers((prev) => prev.filter((p) => p.id !== playerToRemove.id));
          console.log(`Jugador abandonó: ${playerToRemove.nickname}`);
        }
      }
    }, 25000);

    return () => {
      clearInterval(joinInterval);
      clearInterval(leaveInterval);
    };
  }, [players, profile]);

  // Función para obtener la URL de la foto del jugador
  const getPhotoUrl = (player: Player): string => {
    if (!player.photoUrl) return "/images/Logo-login.png";

    // Para la maqueta, si ya es una URL completa, usarla
    if (player.photoUrl.startsWith("http")) {
      return player.photoUrl;
    }

    // Si es una ruta relativa, convertirla (simulación)
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.nickname}`;
  };

  // Simular función para obtener información de jugador
  const getPlayer = async (playerId: string): Promise<Partial<Player>> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPlayerData = {
          pointsAwarded: Math.floor(Math.random() * 200),
          score: Math.floor(Math.random() * 200),
          correct_answers: Math.floor(Math.random() * 10),
        };
        resolve(mockPlayerData);
      }, 500);
    });
  };

  // Función para simular logout (no implementada en maqueta)
  const logout = (): void => {
    console.log("Simulación de logout");
    // En una implementación real: navigate("/");
  };

  return (
    <>
      <div className="container-logo-juagadores-partidas">
        <img src="/images/Logos/Logo-login.png" alt="Logo del juego" />
      </div>

      <div className="div-jugadores-lista-partida">
        <div className="header-jugadores-lista-partida">
          <h3>Jugadores</h3>
        </div>

        {players.length > 0 ? 
          players.map((player, index) => 
            <div key={index} className="div-lista-partida">
              <div>
                  <img
                    src={getPhotoUrl(player)}
                    alt={player.nickname}
                  />
                </div>
                  <p className="truncate">{player.nickname}</p>

                  <div className="puntaje-lista-jugadores">
                    <p className="p-puntos-lista-partida-jugadores truncate">
                      {player.score || "0"} Puntos
                    </p>
                   <p className="p-aciertos-lista-partida-jugadores !hidden">
                       {player.correct_answers ? player.correct_answers : '0'} aciertos
                    </p>
                  </div>

            </div>
          ) : 
            <p className="text-white">No hay jugadores conectados</p>
        }

      </div>
    </>
  );
};

export default ListaJugadores;
