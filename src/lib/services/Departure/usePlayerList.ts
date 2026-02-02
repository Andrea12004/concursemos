// 📁 src/lib/services/Departure/usePlayerList.ts
import { useState, useEffect } from 'react';
import socket from '@/settings/socket';

interface Player {
  id: string;
  profileId: string;
  nickname: string;
  photoUrl: string | null;
  score?: number;
  correctAnswers?: number;
  verified?: boolean;
}

export const useListaJugadores = (timeup: boolean, setFinal: (players: Player[]) => void) => {
  const [players, setPlayers] = useState<Player[]>([]);

  // ✅ 1. ESCUCHAR PERFILES CONECTADOS
  useEffect(() => {
    const handleConnectedProfiles = (data: any) => {
      console.log('[useListaJugadores] Perfiles conectados:', data);

      if (data.profiles && Array.isArray(data.profiles)) {
        setPlayers(data.profiles);
      }
    };

    socket.on('connectedProfiles', handleConnectedProfiles);

    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
    };
  }, []);

  // ✅ 2. ESCUCHAR CUANDO JUGADOR SE VA
  useEffect(() => {
    const handlePlayerLeft = (leftPlayer: any) => {
      console.log('[useListaJugadores] Jugador salió:', leftPlayer);

      setPlayers((prevPlayers) =>
        prevPlayers.filter(player => player.profileId !== leftPlayer.profileId)
      );
    };

    socket.on('playerLeft', handlePlayerLeft);

    return () => {
      socket.off('playerLeft', handlePlayerLeft);
    };
  }, []);

  // ✅ 3. ACTUALIZAR RANKING FINAL CUANDO TERMINA EL TIEMPO
  useEffect(() => {
    if (timeup && players.length > 0) {
      console.log('[useListaJugadores] Tiempo agotado, ordenando jugadores');

      // Ordenar por puntaje de mayor a menor
      const sortedPlayers = [...players].sort((a, b) => 
        (b.score || 0) - (a.score || 0)
      );

      setPlayers(sortedPlayers);
      setFinal(sortedPlayers);
    }
  }, [timeup, players, setFinal]);

  return {
    players
  };
};