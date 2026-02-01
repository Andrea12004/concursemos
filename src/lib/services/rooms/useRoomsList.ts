import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRoomsEndpoint } from '@/lib/api/rooms';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';
import socket from '@/settings/socket';
import { useAuthData } from '@/lib/hooks/useAuthData';

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
  const { profileId: userID, role } = useAuthData();
  
  // Estados principales
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  
  // Refs para evitar re-renders innecesarios
  const hasLoadedRooms = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const limit = 10;

  // ✅ MOVER useMemo AQUÍ (nivel superior del hook)
  const token = useMemo(() => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('cnrsms_token') || 
           '';
  }, []);

  // ✅ Cargar salas
  useEffect(() => {
    if (hasLoadedRooms.current) return;

    const getRooms = async () => {
      setLoading(true);
      try {
        // ✅ Ahora token está disponible
        if (!token) {
          console.warn('⚠️ No hay token');
          setLoading(false);
          return;
        }

        console.log("📡 Cargando salas para listado...");
        const response = await getAllRoomsEndpoint(token);
        
        const filteredRooms = response.filter(
          (room: Room) =>
            room.state !== 'FINALIZADA' && room.state !== 'JUGANDO'
        );
        
        setRooms(filteredRooms);
        hasLoadedRooms.current = true;
        console.log(`✅ ${filteredRooms.length} salas cargadas para listado`);
      } catch (error: any) {
        console.error("❌ Error cargando salas:", error);
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [token, logout]); // ✅ Agregar token a las dependencias

  // Filtrar salas
  const filteredRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];

    let filtered = rooms.filter((room) =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedLevel) {
      filtered = filtered.filter(
        (room) => room.profile.level === selectedLevel
      );
    }

    return filtered;
  }, [rooms, searchQuery, selectedLevel]);

  // Socket.io
  useEffect(() => {
    if (filteredRooms.length === 0) return;

    console.log(`🔌 Configurando socket para ${filteredRooms.length} salas (listado)`);

    const handleConnectedProfiles = (profiles: any) => {
      if (profiles && profiles.profiles && Array.isArray(profiles.profiles)) {
        const count = profiles.profiles.length;
        const roomCode = profiles.roomCode;
        
        setConnectedCounts(prev => ({
          ...prev,
          [roomCode]: count,
        }));
      }
    };

    socket.on("connectedProfiles", handleConnectedProfiles);

    console.log(`📡 Solicitando conteo para ${filteredRooms.length} salas (listado)...`);
    filteredRooms.forEach(room => {
      socket.emit("listConnectedProfiles", { roomCode: room.room_code });
    });

    intervalRef.current = setInterval(() => {
      if (socket.connected) {
        filteredRooms.forEach(room => {
          socket.emit("listConnectedProfiles", { roomCode: room.room_code });
        });
      }
    }, 15000);

    return () => {
      socket.off("connectedProfiles", handleConnectedProfiles);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [filteredRooms]);

  // Mapear a filas de tabla
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

  // Recargar salas manualmente
  const refetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!token) {
        console.warn('⚠️ No hay token para recargar');
        return;
      }

      const response = await getAllRoomsEndpoint(token);
      const filteredRooms = response.filter(
        (room: Room) => room.state !== 'FINALIZADA' && room.state !== 'JUGANDO'
      );
      
      setRooms(filteredRooms);
      console.log(`🔄 ${filteredRooms.length} salas recargadas`);
    } catch (error) {
      console.error("❌ Error recargando salas:", error);
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, logout]); // ✅ Agregar dependencias

  // Cambiar nivel
  const handleLevelChange = useCallback((value: string) => {
    setSelectedLevel(value);
    setPage(1);
  }, []);

  // Navegar a sala
  const handleEnterRoom = useCallback(
    (roomCode: string) => {
      navigate(`/sala/${roomCode}`);
    },
    [navigate]
  );

  return {
    // Estados
    loading,
    tableRows,
    selectedLevel,
    page,
    limit,
    totalItems: filteredRooms.length,
    role,
    token, // ✅ Exportar token
    userID,
    rooms: filteredRooms,
    connectedCounts,

    // Funciones
    setPage,
    handleLevelChange,
    handleEnterRoom,
    refetchRooms,
  };
};