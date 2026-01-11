// lib/services/Dashboard/carousel.ts - VERSIÓN CORREGIDA
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

export const useRooms = (searchQuery = "") => {
  const { logout } = useLogout();
  const { isConnected, emit, on } = useSocket();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  const hasLoadedRooms = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  // 1. Cargar salas SOLO UNA VEZ
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

        console.log("📡 Cargando salas...");
        const response = await getAllRoomsEndpoint(token);

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

  // 2. Socket listeners
  useEffect(() => {
    if (!isConnected || rooms.length === 0) {
      return;
    }

    console.log("🔌 Configurando listeners de salas...");

    const handleConnectedProfiles = (data: any) => {
      if (data?.roomCode) {
        setConnectedCounts(prev => ({
          ...prev,
          [data.roomCode]: data.profiles?.length || 0,
        }));
      }
    };

    const cleanup = on("connectedProfiles", handleConnectedProfiles);

    // Solicitar conteo inicial
    rooms.forEach(room => {
      emit("listConnectedProfiles", { roomCode: room.room_code });
    });

    // Actualizar cada 15 segundos
    intervalRef.current = setInterval(() => {
      if (isConnected) {
        rooms.forEach(room => {
          emit("listConnectedProfiles", { roomCode: room.room_code });
        });
      }
    }, 15000);

    return () => {
      cleanup();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected, rooms, emit, on]);

  return {
    rooms: filteredRooms,
    connectedCounts,
    loading,
  };
};