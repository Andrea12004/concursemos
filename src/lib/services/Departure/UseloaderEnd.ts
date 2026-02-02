// 📁 src/lib/services/Departure/UseloaderEnd.ts
import { useEffect } from 'react';
import socket from '@/settings/socket';
import { useAuthData } from '@/lib/hooks/useAuthData';

interface LoaderEndProps {
  roomId: string;
  roomCode: string;
  profile: any;
  onGameEnd: (result: any) => void;
}

export const useSalaDeEspera = (
  roomId: string,
  roomCode: string,
  profile: any,
  onGameEnd: (result: any) => void
) => {
  const { profile: authProfile } = useAuthData();

  // ✅ 1. EMITIR endGame DESDE UN JUGADOR RANDOM
  useEffect(() => {
    if (!roomCode || !authProfile?.id) return;

    console.log('[useSalaDeEspera] Solicitando perfiles conectados');

    socket.emit('listConnectedProfiles', { roomCode });

    const handleConnectedProfiles = (result: any) => {
      const profiles = result.profiles;

      if (profiles && profiles.length > 0) {
        console.log('[useSalaDeEspera] Perfiles:', profiles);

        // Seleccionar el PRIMER perfil (siempre el mismo para evitar duplicados)
        const firstProfile = profiles[0];

        // Solo el PRIMER perfil emite endGame
        if (firstProfile.profileId === authProfile.id) {
          console.log('[useSalaDeEspera] Emitiendo endGame desde:', authProfile.id);

          socket.emit('endGame', {
            roomId: roomId
          });
        }
      }
    };

    socket.on('connectedProfiles', handleConnectedProfiles);

    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
    };
  }, [roomCode, roomId, authProfile?.id]);

  // ✅ 2. ESCUCHAR gameEnded
  useEffect(() => {
    const handleGameEnded = (result: any) => {
      console.log('[useSalaDeEspera] Juego terminado:', result);
      onGameEnd(result);
    };

    socket.on('gameEnded', handleGameEnded);

    return () => {
      socket.off('gameEnded', handleGameEnded);
    };
  }, [onGameEnd]);
};