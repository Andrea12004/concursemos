// lib/services/Dashboard/carousel.ts - VERSIÓN OPTIMIZADA CON SOCKET
import { useEffect, useMemo, useState, useRef } from "react";
import { getAllRoomsEndpoint } from "@/lib/api/rooms";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { useLogout } from "@/lib/hooks/useLogout";
import { useSocket } from "@/lib/hooks/useSocket";

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
 * Hook para cargar y actualizar salas en tiempo real con Socket.IO
 * Mantiene sincronización del conteo de jugadores por sala
 */
export const useRooms = (searchQuery = "") => {
  const { logout } = useLogout();
  const { socket, isConnected, emit, on } = useSocket();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  const hasLoadedRooms = useRef(false);
  const listenersSetup = useRef(false);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filtrar salas por búsqueda
  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  // 1. CARGAR SALAS DESDE API (una sola vez)
  useEffect(() => {
    if (hasLoadedRooms.current) return;

    const loadRooms = async () => {
      try {
        const auth = localStorage.getItem("authResponse");
        if (!auth) {
          setLoading(false);
          return;
        }

        const token = JSON.parse(auth)?.accesToken;
        if (!token) {
          setLoading(false);
          return;
        }

        console.log("📡 Cargando salas desde API...");
        const response = await getAllRoomsEndpoint(token);

        // Filtrar solo salas disponibles
        const availableRooms = response.filter(
          (room: any) =>
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

  // 2. CONFIGURAR LISTENERS SOCKET (una sola vez)
  useEffect(() => {
    if (!socket || !isConnected || listenersSetup.current) {
      return;
    }

    console.log("🔌 Configurando listeners Socket.IO para salas...");
    listenersSetup.current = true;

    // Handler para respuesta de perfiles conectados
    const handleConnectedProfiles = (data: any) => {
      if (data.roomCode) {
        const count = data.profiles?.length || 0;
        setConnectedCounts(prev => ({
          ...prev,
          [data.roomCode]: count,
        }));
      }
    };

    // Registrar listener
    const cleanup = on("connectedProfiles", handleConnectedProfiles);

    // Función para solicitar jugadores de todas las salas
    const requestAllRoomCounts = () => {
      if (!socket.connected) return;

      rooms.forEach(room => {
        if (room.room_code) {
          emit("listConnectedProfiles", { roomCode: room.room_code });
        }
      });
    };

    // Solicitar inmediatamente
    if (rooms.length > 0) {
      requestAllRoomCounts();
    }

    // Actualizar cada 15 segundos
    updateIntervalRef.current = setInterval(() => {
      if (socket.connected && rooms.length > 0) {
        requestAllRoomCounts();
      }
    }, 15000);

    // Cleanup
    return () => {
      console.log("🧹 Limpiando listeners de salas");
      cleanup();
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      listenersSetup.current = false;
    };
  }, [socket, isConnected, rooms, emit, on]);

  // 3. ACTUALIZAR CONTEOS cuando las salas cambian
  useEffect(() => {
    if (!socket || !isConnected || rooms.length === 0) {
      return;
    }

    console.log(`📤 Solicitando jugadores para ${rooms.length} salas...`);

    rooms.forEach(room => {
      if (room.room_code) {
        emit("listConnectedProfiles", { roomCode: room.room_code });
      }
    });
  }, [rooms, socket, isConnected, emit]);

  return {
    rooms: filteredRooms,
    connectedCounts,
    loading,
  };
};