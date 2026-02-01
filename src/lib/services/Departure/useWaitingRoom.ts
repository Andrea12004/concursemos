// 📁 src/lib/services/Departure/useWaitingRoom.ts
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '@/settings/socket';
import { getRoomByCodeEndpoint } from '@/lib/api/rooms';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';

export interface Player {
  id: string;
  nickname: string;
  photoUrl?: string;
  verified?: boolean;
}

export const useWaitingRoom = (roomCode: string) => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  
  // Estados
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const [host, setHost] = useState('');
  const [privada, setPrivada] = useState(false);
  const [programmed, setProgrammed] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  // Refs para evitar dependencias circulares
  const profileRef = useRef<any>(null);
  const hasJoinedRef = useRef(false);

  /**
   * ============================================
   * 1️⃣ CARGAR AUTENTICACIÓN - SOLO UNA VEZ
   * ============================================
   */
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse) {
      setToken(authResponse.accesToken);
      setProfile(authResponse.user?.profile);
      setUser(authResponse.user);
      profileRef.current = authResponse.user?.profile;
    }
  }, []); // ✅ Solo al montar

  /**
   * ============================================
   * 2️⃣ OBTENER DATOS DE LA SALA
   * ============================================
   */
  useEffect(() => {
    if (!token || !roomCode) return;

    const getRoom = async () => {
      try {
        const response = await getRoomByCodeEndpoint(token, roomCode);
        
        setRoomId(response.id);
        setHost(response.profile.id);
        setPrivada(response.is_private);

        if (response.start_time) {
          setProgrammed(true);
        }

        console.log('✅ Sala cargada:', response);
      } catch (error: any) {
        handleAxiosError(error, logout);
      }
    };

    getRoom();
  }, [token, roomCode, logout]); // ✅ Solo cuando cambia token o roomCode

  /**
   * ============================================
   * 3️⃣ UNIRSE A LA SALA - SOLO UNA VEZ
   * ============================================
   */
  useEffect(() => {
    if (!roomCode || !profile?.id || hasJoinedRef.current) return;

    console.log(`⏳ Uniéndose a sala: ${roomCode}`);
    
    socket.emit('joinSala', {
      profileId: profile.id,
      room_code: roomCode,
    });

    socket.emit('listConnectedProfiles', { roomCode });
    
    hasJoinedRef.current = true; // Marcar como unido

  }, [roomCode, profile?.id]); // ✅ Solo cuando profile esté listo

  /**
   * ============================================
   * 4️⃣ INVITAR JUGADORES
   * ============================================
   */
  useEffect(() => {
    if (!roomId || !host || !profile?.id) return;

    socket.emit('invitePlayer', {
      roomId: roomId,
      hostId: host,
      invitedIds: [profile.id],
    });

    const handlePlayerInvited = (newPlayer: any) => {
      console.log('✅ Jugador invitado:', newPlayer);
      socket.emit('joinSala', {
        profileId: profile.id,
        room_code: roomCode,
      });
    };

    socket.on('playerInvited', handlePlayerInvited);

    return () => {
      socket.off('playerInvited', handlePlayerInvited);
    };
  }, [roomId, host, profile?.id, roomCode]); // ✅ Dependencias necesarias

  /**
   * ============================================
   * 5️⃣ ESCUCHAR EVENTOS DE SOCKET - SIN players EN DEPS
   * ============================================
   */
  useEffect(() => {
    if (!roomCode) return;

    /**
     * Perfiles conectados
     */
    const handleConnectedProfiles = (data: any) => {
      console.log('👥 Perfiles conectados:', data);
      
      if (data?.profiles && Array.isArray(data.profiles)) {
        setPlayers(data.profiles);
      }
    };

    /**
     * Jugador se unió
     */
    const handlePlayerJoined = (newPlayer: any) => {
      console.log('➕ Jugador se unió:', newPlayer);
      socket.emit('listConnectedProfiles', { roomCode });
    };

    /**
     * Jugador salió
     */
    const handlePlayerLeft = (leftPlayer: any) => {
      console.log('➖ Jugador salió:', leftPlayer);
      socket.emit('listConnectedProfiles', { roomCode });
    };

    /**
     * Errores
     */
    const handleError = (error: any) => {
      console.error('❌ Error en sala:', error);
    };

    // Registrar listeners
    socket.on('connectedProfiles', handleConnectedProfiles);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('error', handleError);

    // Cleanup
    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('error', handleError);
    };
  }, [roomCode]); // ✅ SOLO roomCode - NO players para evitar loops

  /**
   * ============================================
   * FUNCIONES PÚBLICAS
   * ============================================
   */

  /**
   * Salir de la sala
   */
  const leaveSala = () => {
    console.log('👋 Saliendo de la sala...');
    
    if (profile?.id && roomCode) {
      socket.emit('leaveSala', {
        profileId: profile.id,
        room_code: roomCode,
      });
    }
    
    hasJoinedRef.current = false; // Reset flag
    navigate('/dashboard');
  };


  /**
   * ============================================
   * RETORNO DEL HOOK
   * ============================================
   */
  return {
    // Estados
    players,
    host,
    profile,
    user,
    programmed,
    privada,
    roomId,
    token,
    
    // Funciones
    leaveSala,
    
    // Valores computados
    canStart: programmed && host === profile?.id,
    isHost: host === profile?.id,
    playerCount: players.length,
  };
};