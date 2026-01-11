// src/lib/services/Dashboard/carousel.ts - PATRÓN SIMPLE CON SOCKET DIRECTO
import { useEffect, useMemo, useState, useRef } from "react";
import { getAllRoomsEndpoint } from "@/lib/api/rooms";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { useLogout } from "@/lib/hooks/useLogout";
import socket from "@/settings/socket"; // ⭐ Import directo del socket

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
 * Hook useRooms - Gestiona las salas y jugadores conectados
 * 
 * Usa el patrón simple: socket importado directamente
 * Mantiene la estructura organizada con hooks personalizados
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
    if (hasLoadedRooms.current) {
      console.log('♻️ [useRooms] Salas ya cargadas');
      return;
    }

    const loadRooms = async () => {
      try {
        const auth = localStorage.getItem("authResponse");
        if (!auth) {
          console.warn('⚠️ [useRooms] No hay authResponse');
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(auth);
        const token = parsed.accesToken || parsed.accessToken || parsed.token;
        
        if (!token) {
          console.warn('⚠️ [useRooms] No hay token');
          setLoading(false);
          return;
        }

        console.log("📡 [useRooms] Cargando salas...");
        const response = await getAllRoomsEndpoint(token);

        // Filtrar solo salas disponibles
        const availableRooms = response.filter(
          (room: Room) =>
            room.start_date == null &&
            room.state !== "FINALIZADA" &&
            room.state !== "JUGANDO"
        );
        
        setRooms(availableRooms);
        hasLoadedRooms.current = true;
        console.log(`✅ [useRooms] ${availableRooms.length} salas cargadas`);
      } catch (error) {
        console.error("❌ [useRooms] Error cargando salas:", error);
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [logout]);

  /**
   * 2. SOCKET.IO - Escuchar conteo de jugadores
   * 
   * ⭐ Usa socket directamente, como en el patrón original
   */
  useEffect(() => {
    // Solo actuar si hay salas cargadas
    if (rooms.length === 0) {
      console.log('⏳ [useRooms] Esperando salas...');
      return;
    }

    console.log(`🔌 [useRooms] Configurando listeners para ${rooms.length} salas`);

    /**
     * Handler para recibir perfiles conectados
     */
    const handleConnectedProfiles = (data: any) => {
      if (data?.roomCode && Array.isArray(data.profiles)) {
        const count = data.profiles.length;
        
        setConnectedCounts(prev => ({
          ...prev,
          [data.roomCode]: count,
        }));
        
        console.log(`👥 [useRooms] ${count} jugadores en ${data.roomCode}`);
      }
    };

    // ⭐ Registrar listener usando socket directamente
    socket.on("connectedProfiles", handleConnectedProfiles);

    /**
     * Solicitar conteo inicial para todas las salas
     */
    console.log(`📡 [useRooms] Solicitando conteo de ${rooms.length} salas...`);
    rooms.forEach(room => {
      socket.emit("listConnectedProfiles", { roomCode: room.room_code });
    });

    /**
     * Actualizar conteo periódicamente (cada 15 segundos)
     */
    intervalRef.current = setInterval(() => {
      if (socket.connected) {
        console.log(`🔄 [useRooms] Actualizando conteo...`);
        rooms.forEach(room => {
          socket.emit("listConnectedProfiles", { roomCode: room.room_code });
        });
      } else {
        console.warn('⚠️ [useRooms] Socket desconectado, saltando actualización');
      }
    }, 15000); // 15 segundos

    /**
     * Cleanup - Limpiar listeners y timers
     */
    return () => {
      socket.off("connectedProfiles", handleConnectedProfiles);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      console.log('🧹 [useRooms] Listeners y timers limpiados');
    };
  }, [rooms]); // Dependencia: rooms

  /**
   * Retornar datos
   */
  return {
    rooms: filteredRooms,
    connectedCounts,
    loading,
    totalRooms: rooms.length,
  };
};

/**
 * Hook useRoomDetails - Detalles de una sala específica
 * 
 * Opcional: Para obtener detalles y conteo de una sala en particular
 */
export const useRoomDetails = (roomCode: string | null) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [connectedCount, setConnectedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cargar detalles de la sala
  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    const loadRoom = async () => {
      try {
        const auth = localStorage.getItem("authResponse");
        if (!auth) return;

        const parsed = JSON.parse(auth);
        const token = parsed.accesToken || parsed.accessToken || parsed.token;
        if (!token) return;

        const rooms = await getAllRoomsEndpoint(token);
        const foundRoom = rooms.find((r: Room) => r.room_code === roomCode);
        
        setRoom(foundRoom || null);
      } catch (error) {
        console.error("❌ Error cargando sala:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomCode]);

  // Escuchar conteo de jugadores
  useEffect(() => {
    if (!roomCode) return;

    const handleConnectedProfiles = (data: any) => {
      if (data.roomCode === roomCode) {
        setConnectedCount(data.profiles?.length || 0);
      }
    };

    socket.on("connectedProfiles", handleConnectedProfiles);
    socket.emit("listConnectedProfiles", { roomCode });

    return () => {
      socket.off("connectedProfiles", handleConnectedProfiles);
    };
  }, [roomCode]);

  return {
    room,
    connectedCount,
    loading,
  };
};