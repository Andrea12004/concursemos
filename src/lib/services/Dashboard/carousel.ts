// src/lib/services/Dashboard/carousel.ts - CORREGIDO PARA FUNCIONAR COMO EL ORIGINAL
import { useEffect, useMemo, useState, useRef } from "react";
import { getAllRoomsEndpoint } from "@/lib/api/rooms";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { useLogout } from "@/lib/hooks/useLogout";
import socket from "@/settings/socket"; 

/**
 * Interfaz para una sala
 */
interface Room {
  id: string;
  room_name: string;
  room_code: string;
  max_user: number;
  number_questions: number;
  time_question: number;
  start_date: string | null;
  state: string;
}

/**
 * Hook useRooms - IGUAL QUE EN EL PROYECTO ORIGINAL
 * 
 * Gestiona las salas y jugadores conectados usando Socket.IO
 */
export const useRooms = (searchQuery = "") => {
  const { logout } = useLogout();
  
  // Estados
  const [rooms, setRooms] = useState<Room[]>([]);
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Refs para control
  const hasLoadedRooms = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Salas filtradas por búsqueda
   */
  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    
    return rooms.filter(room =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  /**
   * 1. CARGAR SALAS - Solo una vez al montar
   */
  useEffect(() => {
    if (hasLoadedRooms.current) return;

    const loadRooms = async () => {
      try {
        const auth = localStorage.getItem("authResponse");
        if (!auth) {
          console.warn('⚠️ No hay authResponse');
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(auth);
        const token = parsed.accesToken || parsed.accessToken || parsed.token;
        
        if (!token) {
          console.warn('⚠️ No hay token');
          setLoading(false);
          return;
        }

        console.log("📡 Cargando salas...");
        const response = await getAllRoomsEndpoint(token);

        // Filtrar solo salas disponibles (IGUAL QUE EL ORIGINAL)
        const availableRooms = response.filter(
          (room: Room) =>
            room.start_date == null &&
            room.state !== "FINALIZADA" &&
            room.state !== "JUGANDO"
        );
        
        setRooms(availableRooms);
        hasLoadedRooms.current = true;
        console.log(`✅ ${availableRooms.length} salas cargadas`);
      } catch (error) {
        console.error("❌ Error cargando salas:", error);
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [logout]);

  /**
   * 2. SOCKET.IO - EXACTAMENTE COMO EN EL PROYECTO ORIGINAL
   */
  useEffect(() => {
    if (rooms.length === 0) return;

    console.log(`🔌 Configurando socket para ${rooms.length} salas`);

    /**
     * Handler para recibir perfiles conectados
     * IGUAL QUE EN carousel.jsx del proyecto original
     */
    const handleConnectedProfiles = (profiles: any) => {
      console.log('📥 Datos recibidos:', profiles);
      
      // El original espera: { profiles: { profiles: [...], roomCode: '...' } }
      if (profiles && profiles.profiles && Array.isArray(profiles.profiles)) {
        const count = profiles.profiles.length;
        const roomCode = profiles.roomCode;
        
        setConnectedCounts(prev => ({
          ...prev,
          [roomCode]: count,
        }));
        
        console.log(`👥 ${count} jugadores en ${roomCode}`);
      }
    };

    // Registrar listener (IGUAL QUE EL ORIGINAL)
    socket.on("connectedProfiles", handleConnectedProfiles);

    // Solicitar conteo inicial para todas las salas (IGUAL QUE EL ORIGINAL)
    console.log(`📡 Solicitando conteo de ${rooms.length} salas...`);
    rooms.forEach(room => {
      socket.emit("listConnectedProfiles", { roomCode: room.room_code });
    });

    // Actualizar conteo cada 15 segundos (IGUAL QUE EL ORIGINAL)
    intervalRef.current = setInterval(() => {
      if (socket.connected) {
        console.log(`🔄 Actualizando conteo...`);
        rooms.forEach(room => {
          socket.emit("listConnectedProfiles", { roomCode: room.room_code });
        });
      }
    }, 15000);

    // Cleanup
    return () => {
      socket.off("connectedProfiles", handleConnectedProfiles);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      console.log('🧹 Listeners limpiados');
    };
  }, [rooms]);

  return {
    rooms: filteredRooms,
    connectedCounts,
    loading,
    totalRooms: rooms.length,
  };
};