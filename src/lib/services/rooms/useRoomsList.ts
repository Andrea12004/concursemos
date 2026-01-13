// src/lib/hooks/useRoomsList.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRoomsEndpoint } from '@/lib/api/rooms';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';
import socket from '@/settings/socket';

interface Room {
  id: string;
  room_name: string;
  is_private: boolean;
  profile: {
    id: string;
    level: string;
  };
  start_date: string | null;
  categories: { category: string }[];
  number_questions: number;
  room_code: string;
  max_user: number;
  time_question: number;
  state: string;
}

interface UseRoomsListProps {
  searchQuery: string;
}

export const useRoomsList = ({ searchQuery }: UseRoomsListProps) => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  
  // Estados principales
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  
  // Refs para evitar re-renders innecesarios
  const hasLoadedRooms = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const limit = 10; // Items por página para MuiTable

  /**
   * ============================================
   * 1️⃣ CARGAR TOKEN Y DATOS DEL USUARIO
   * ============================================
   */
  useEffect(() => {
    const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
    if (authResponse?.accesToken) {
      setToken(authResponse.accesToken);
      setUserID(authResponse.user?.profile?.id || '');
      setRole(authResponse.user?.role || '');
    }
  }, []);

  /**
   * ============================================
   * 2️⃣ OBTENER SALAS - EXACTAMENTE COMO EL ORIGINAL
   * ============================================
   */
  useEffect(() => {
    if (!token || hasLoadedRooms.current) return;

    const getRooms = async () => {
      setLoading(true);
      try {
        const response = await getAllRoomsEndpoint(token);
        
        // Filtrar EXACTAMENTE como el original
        const filteredRooms = response.filter(
          (room: Room) =>
            room.state !== 'FINALIZADA' && room.state !== 'JUGANDO'
        );
        
        setRooms(filteredRooms);
        hasLoadedRooms.current = true;
        console.log(`✅ ${filteredRooms.length} salas cargadas`);
      } catch (error: any) {
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [token, logout]);

  /**
   * ============================================
   * 3️⃣ FILTRAR SALAS - EXACTAMENTE COMO EL ORIGINAL
   * ============================================
   */
  const filteredRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];

    // Filtrar por búsqueda (IGUAL AL ORIGINAL)
    let filtered = rooms.filter((room) =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtrar por nivel (IGUAL AL ORIGINAL)
    if (selectedLevel) {
      filtered = filtered.filter(
        (room) => room.profile.level === selectedLevel
      );
    }

    return filtered;
  }, [rooms, searchQuery, selectedLevel]);

  /**
   * ============================================
   * 4️⃣ SOCKET.IO - EXACTAMENTE COMO EL ORIGINAL
   * ============================================
   */
  useEffect(() => {
    if (filteredRooms.length === 0) return;

    console.log(`🔌 Configurando socket para ${filteredRooms.length} salas`);

    /**
     * Handler para recibir perfiles conectados
     * EXACTAMENTE COMO EL ORIGINAL: profiles.profiles.length
     */
    const handleConnectedProfiles = (profiles: any) => {
      console.log('📥 Perfiles recibidos:', profiles);
      
      if (profiles?.profiles && Array.isArray(profiles.profiles)) {
        // Actualizar conteo por room_code
        setConnectedCounts((prev) => ({
          ...prev,
          [profiles.roomCode || profiles.room_code]: profiles.profiles.length,
        }));
      }
    };

    // Registrar listener
    socket.on('connectedProfiles', handleConnectedProfiles);

    // Solicitar conteo inicial para cada sala
    filteredRooms.forEach((room) => {
      socket.emit('listConnectedProfiles', { roomCode: room.room_code });
    });

    // Cleanup
    return () => {
      socket.off('connectedProfiles', handleConnectedProfiles);
    };
  }, [filteredRooms]);

  /**
   * ============================================
   * 5️⃣ PREPARAR DATOS PARA MUITABLE
   * Transformar rooms al formato que espera MuiTable
   * ============================================
   */
  const tableRows = useMemo(() => {
    return filteredRooms.map((room) => ({
      id: room.id,
      room_name: room.room_name,
      room_type: room.is_private ? 'PRIVADA' : 'PUBLICA',
      player_level: room.profile.level,
      level_image: `/images/niveles/${room.profile.level}.png`,
      start_date: room.start_date || 'No programada',
      categories: room.categories
        ? room.categories.map((cat) => cat.category).join(', ')
        : 'Cargando...',
      number_questions: `${room.number_questions} Preguntas`,
      players_count: `${connectedCounts[room.room_code] || 0} de ${room.max_user}`,
      time_question: `${room.time_question} segundos`,
      room_code: room.room_code,
      can_delete: role === 'ADMIN' || room.profile.id === userID,
    }));
  }, [filteredRooms, connectedCounts, role, userID]);

  /**
   * ============================================
   * FUNCIONES
   * ============================================
   */
  
  // Cambiar nivel (resetea paginación)
  const handleLevelChange = useCallback((value: string) => {
    setSelectedLevel(value);
    setPage(1); // Reiniciar a la primera página al filtrar
  }, []);

  // Navegar a sala
  const handleEnterRoom = useCallback(
    (roomCode: string) => {
      navigate(`/sala/${roomCode}`);
    },
    [navigate]
  );

  /**
   * ============================================
   * RETORNO DEL HOOK
   * ============================================
   */
  return {
    // Estados
    loading,
    tableRows,
    selectedLevel,
    page,
    limit,
    totalItems: filteredRooms.length,
    role,
    token,
    userID,

    // Funciones
    setPage,
    handleLevelChange,
    handleEnterRoom,
  };
};