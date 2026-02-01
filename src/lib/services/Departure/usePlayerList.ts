import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '@/settings/socket';
import { getProfileByIdEndpoint } from '@/lib/api/profile'; 
import { handleAxiosError } from '@/lib/utils/parseErrors';

import type { Player, Profile } from '@/lib/types/playerList';

export const useListaJugadores = (
  timeup: boolean,
  setFinal: (players: Player[]) => void
) => {

  const { id: roomId } = useParams<{ id: string }>();

  const [token, setToken] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  // 1️⃣ Cargar token y perfil
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');

    if (authResponse?.accesToken) {
      setToken(authResponse.accesToken);
      setProfile(authResponse.user?.profile ?? null);
    }
  }, []);

  // 2️⃣ Emitir jugadores conectados
  useEffect(() => {
    if (!roomId) return;

    socket.emit('listConnectedProfiles', { roomCode: roomId });

    return () => {
      socket.off('connectedProfiles');
    };
  }, [roomId]);

  // 3️⃣ Escuchar jugadores conectados
  useEffect(() => {
    const handleConnectedProfiles = (data: { profiles: Player[] }) => {
      if (Array.isArray(data?.profiles)) {
        setPlayers([...data.profiles]);
      }
    };

    socket.on('connectedProfiles', handleConnectedProfiles);

    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
    };
  }, [roomId, profile, timeup]);

  // 4️⃣ Obtener info jugador
  const getPlayer = async (playerId: string): Promise<Player | null> => {
    if (!token) return null;

    try {
      const response = await getProfileByIdEndpoint(token, playerId);
      return response.data?.profile ?? null;
    } catch (error) {
      handleAxiosError(error);
      return null;
    }
  };

  // 5️⃣ Actualizar cuando termina el tiempo
  useEffect(() => {
    if (!timeup || !token) return;

    const updatePlayersInfo = async () => {
      const updated = await Promise.all(
        players.map(async (player) => {
          const profileData = await getPlayer(player.id);
          return profileData ? { ...player, ...profileData } : player;
        })
      );

      updated.sort(
        (a, b) => (b.pointsAwarded ?? 0) - (a.pointsAwarded ?? 0)
      );

      setPlayers(updated);
      setFinal(updated);
    };

    updatePlayersInfo();
  }, [timeup]); // 👈 igual que el original

  // 6️⃣ Jugador sale
  useEffect(() => {
    const handlePlayerLeft = (leftPlayer: { profileId: string }) => {
      setPlayers(prev =>
        prev.filter(p => p.profileId !== leftPlayer.profileId)
      );
    };

    socket.on('playerLeft', handlePlayerLeft);

    return () => {
      socket.off('playerLeft', handlePlayerLeft);
    };
  }, []);

  return {
    players,
    token,
    profile,
  };
};
