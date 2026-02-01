import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { getAllRoomsEndpoint } from "@/lib/api/rooms";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { useLogout } from "@/lib/hooks/useLogout";
import socket from "@/settings/socket";

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
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // useRef para evitar múltiples cargas
  const hasLoaded = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const token = useMemo(() => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('cnrsms_token') || 
           '';
  }, []);

  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    
    return rooms.filter(room =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  const loadRooms = useCallback(async () => {
    if (!token) {
      console.warn(' No hay token');
      setLoading(false);
      return;
    }

    try {
   
      const response = await getAllRoomsEndpoint(token);

      const availableRooms = response.filter(
        (room: Room) =>
          room.start_date == null &&
          room.state !== "FINALIZADA" &&
          room.state !== "JUGANDO"
      );
      
      setRooms(availableRooms);

    } catch (error) {

      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Cargar solo UNA vez usando 
  useEffect(() => {
    if (hasLoaded.current) return; // ← Evita cargas múltiples
    
    hasLoaded.current = true;
    loadRooms();
  }, []); 

  // Socket.IO
  useEffect(() => {
    if (rooms.length === 0) return;


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

    rooms.forEach(room => {
      socket.emit("listConnectedProfiles", { roomCode: room.room_code });
    });

    intervalRef.current = setInterval(() => {
      if (socket.connected) {
        rooms.forEach(room => {
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
  }, [rooms]);

  return {
    rooms: filteredRooms,
    connectedCounts,
    loading,
    totalRooms: rooms.length,
    refetchRooms: loadRooms, // Para refrescar manualmente
  };
};