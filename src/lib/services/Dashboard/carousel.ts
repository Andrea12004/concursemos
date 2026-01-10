// hooks/useRooms.ts - VERSIÓN MEJORADA
import { useEffect, useMemo, useState, useRef } from "react";
import { getAllRoomsEndpoint } from "@/lib/api/rooms";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { useLogout } from "@/lib/hooks/useLogout";
import { socketSingleton } from "@/settings/socket"; // Importar singleton

export const useRooms = (searchQuery = "") => {
  const { logout } = useLogout();
  const [rooms, setRooms] = useState<any[]>([]);
  const [connectedCounts, setConnectedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  const hasLoaded = useRef(false);
  const socketListenersSet = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rooms, searchQuery]);

  // Cargar salas (UNA SOLA VEZ)
  useEffect(() => {
    if (hasLoaded.current) return;
    
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
        hasLoaded.current = true;
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

  // Configurar socket listeners (UNA VEZ)
  useEffect(() => {
    if (socketListenersSet.current) return;
    
    console.log("🔌 Configurando listeners de socket para salas...");
    socketListenersSet.current = true;

    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const setupSocket = async () => {
      try {
        // Obtener socket del singleton
        const socket = await socketSingleton.getSocket();
        if (!socket || !mounted) return;

        console.log("✅ Socket disponible para salas");

        // Listener para jugadores conectados
        const handleConnectedProfiles = (data: any) => {
          if (data.roomCode && mounted) {
            setConnectedCounts(prev => ({
              ...prev,
              [data.roomCode]: data.profiles?.length || 0,
            }));
          }
        };

        socket.on("connectedProfiles", handleConnectedProfiles);

        // Función para solicitar jugadores
        const requestConnectedPlayers = () => {
          if (!socket.connected || !mounted) return;
          
          rooms.forEach(room => {
            if (room.room_code) {
              socket.emit("listConnectedProfiles", {
                roomCode: room.room_code,
              });
            }
          });
        };

        // Solicitar inicialmente
        requestConnectedPlayers();

        // Configurar intervalo (solo si hay salas)
        if (rooms.length > 0) {
          intervalId = setInterval(requestConnectedPlayers, 30000);
        }

        // Guardar cleanup function
        cleanupRef.current = () => {
          socket.off("connectedProfiles", handleConnectedProfiles);
          if (intervalId) clearInterval(intervalId);
        };

      } catch (error) {
        console.error("❌ Error configurando socket listeners:", error);
      }
    };

    setupSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      socketListenersSet.current = false;
    };
  }, []); // Solo una vez

  // Actualizar cuando cambian las salas
  useEffect(() => {
    const socket = socketSingleton.getCurrentSocket();
    if (!socket || !socket.connected || rooms.length === 0) return;

    console.log(`📤 Solicitando jugadores para ${rooms.length} salas...`);
    
    rooms.forEach(room => {
      if (room.room_code) {
        socket.emit("listConnectedProfiles", {
          roomCode: room.room_code,
        });
      }
    });
  }, [rooms]); // Solo cuando las salas cambian

  return {
    rooms: filteredRooms,
    connectedCounts,
    loading,
  };
};