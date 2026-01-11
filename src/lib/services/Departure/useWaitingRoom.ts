// 📁 src/lib/services/Departure/useWaitingRoom.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '@/settings/socket';
import axios from 'axios';
import Swal from 'sweetalert2';

export interface Player {
  id: string;
  nickname: string;
  photoUrl?: string;
  verified?: boolean;
}

export const useWaitingRoom = (roomCode: string) => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const [host, setHost] = useState('');
  const [privada, setPrivada] = useState(false);
  const [programmed, setProgrammed] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  /**
   * Cargar autenticación
   */
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse) {
      setToken(authResponse.accesToken);
      setProfile(authResponse.user?.profile);
    }
  }, []);

  /**
   * Obtener datos de la sala
   */
  useEffect(() => {
    if (!token) return;

    const getRoom = async () => {
      const headers = { cnrsms_token: token };
      try {
        const response = await axios.get(`/rooms/by-code/${roomCode}`, { headers });
        setRoomId(response.data.id);
        setHost(response.data.profile.id);
        setPrivada(response.data.is_private);

        if (response.data.start_time) {
          setProgrammed(true);
        }
      } catch (error: any) {
        if (error.response?.data?.message === 'Token expirado') {
          Swal.fire({
            title: 'Token Expirado',
            text: 'Vuelve a ingresar a la plataforma',
            icon: 'error',
          });
          navigate('/');
        }
      }
    };

    getRoom();
  }, [token, roomCode, navigate]);

  /**
   * Unirse a la sala de espera
   */
  useEffect(() => {
    if (!roomCode || !profile) return;

    socket.emit('joinSala', {
      profileId: profile.id,
      room_code: roomCode,
    });

    socket.emit('listConnectedProfiles', { roomCode });

    console.log(`⏳ Esperando en sala: ${roomCode}`);
  }, [roomCode, profile]);

  /**
   * Invitar jugadores (si eres el host)
   */
  useEffect(() => {
    if (!roomId || !host || !profile) return;

    socket.emit('invitePlayer', {
      roomId: roomId,
      hostId: host,
      invitedIds: [profile.id],
    });

    socket.on('playerInvited', () => {
      socket.emit('joinSala', {
        profileId: profile.id,
        room_code: roomCode,
      });
    });

    return () => {
      socket.off('playerInvited');
    };
  }, [roomCode, profile, roomId, host]);

  /**
   * Escuchar jugadores conectados
   */
  useEffect(() => {
    const handleConnectedProfiles = (data: any) => {
      if (data?.profiles) {
        setPlayers(data.profiles);
      }
    };

    const handlePlayerJoined = () => {
      socket.emit('listConnectedProfiles', { roomCode });
    };

    const handlePlayerLeft = () => {
      socket.emit('listConnectedProfiles', { roomCode });
    };

    const handleError = (error: any) => {
      console.error('❌ Error:', error);
    };

    socket.on('connectedProfiles', handleConnectedProfiles);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('error', handleError);

    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('error', handleError);
    };
  }, [roomCode]);

  /**
   * Salir de la sala
   */
  const leaveSala = () => {
    socket.emit('leaveSala', {
      profileId: profile?.id,
      room_code: roomCode,
    });
    navigate('/dashboard');
  };

  /**
   * Iniciar partida (solo host)
   */
  const startGame = () => {
    socket.emit('startGame', { roomId });
  };

  return {
    players,
    host,
    profile,
    programmed,
    leaveSala,
    startGame,
    canStart: programmed && host === profile?.id,
  };
};