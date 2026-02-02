// 📁 src/lib/services/Departure/useWaitingRoom.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '@/settings/socket';
import { useAuthData } from '@/lib/hooks/useAuthData';

interface Player {
  id: string;
  profileId: string;
  nickname: string;
  photoUrl: string | null;
  verified?: boolean;
}

export const useWaitingRoom = (roomCode: string) => {
  const { profile } = useAuthData();
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<Player[]>([]);

  // ✅ 1. UNIRSE A LA SALA automáticamente
  useEffect(() => {
    if (!roomCode || !profile?.id) return;

    console.log('[useWaitingRoom] Uniéndose a sala:', roomCode);

    socket.emit('joinSala', {
      profileId: profile.id,
      room_code: roomCode
    });

    socket.emit('listConnectedProfiles', { roomCode });

    return () => {
      console.log('[useWaitingRoom] Limpiando sala');
    };
  }, [roomCode, profile?.id]);

  // ✅ 2. ESCUCHAR JUGADORES CONECTADOS
  useEffect(() => {
    const handleConnectedProfiles = (data: any) => {
      console.log('[useWaitingRoom] Perfiles conectados:', data);
      
      if (data.profiles && Array.isArray(data.profiles)) {
        setPlayers(data.profiles);
      }
    };

    socket.on('connectedProfiles', handleConnectedProfiles);

    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
    };
  }, []);

  // ✅ 3. ESCUCHAR NUEVOS JUGADORES
  useEffect(() => {
    const handlePlayerJoined = (newPlayer: any) => {
      console.log('[useWaitingRoom] Nuevo jugador:', newPlayer);
      socket.emit('listConnectedProfiles', { roomCode });
    };

    socket.on('playerJoined', handlePlayerJoined);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
    };
  }, [roomCode]);

  // ✅ 4. ESCUCHAR JUGADORES QUE SE VAN
  useEffect(() => {
    const handlePlayerLeft = (leftPlayer: any) => {
      console.log('[useWaitingRoom] Jugador salió:', leftPlayer);
      socket.emit('listConnectedProfiles', { roomCode });
    };

    socket.on('playerLeft', handlePlayerLeft);

    return () => {
      socket.off('playerLeft', handlePlayerLeft);
    };
  }, [roomCode]);

  // ✅ 5. ESCUCHAR ERRORES
  useEffect(() => {
    const handleError = (error: any) => {
      console.error('[useWaitingRoom] Error:', error);
    };

    socket.on('error', handleError);

    return () => {
      socket.off('error', handleError);
    };
  }, []);

  // ✅ 6. FUNCIÓN PARA SALIR DE LA SALA
  const leaveSala = () => {
    if (profile?.id && roomCode) {
      console.log('[useWaitingRoom] Saliendo de sala');
      socket.emit('leaveSala', { 
        profileId: profile.id, 
        room_code: roomCode 
      });
      navigate('/dashboard');
    }
  };

  return {
    players,
    leaveSala
  };
};