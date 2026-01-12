// src/lib/hooks/useProgrammedRooms.ts
import { useState, useEffect, useRef } from 'react';
import { getAllRoomsEndpoint } from '@/lib/api/rooms';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';

interface Room {
  id: string;
  room_name: string;
  room_code: string;
  start_date: string | null;
  start_time?: string;
  state: string;
  [key: string]: any;
}

/**
 * ============================================
 * HOOK: useProgrammedRooms
 * 
 * Obtiene salas programadas (start_date !== null)
 * Usado en el carrusel de salas
 * ============================================
 */
export const useProgrammedRooms = () => {
  const { logout } = useLogout();
  
  // Estados
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Ref para evitar múltiples llamadas
  const hasLoadedRooms = useRef(false);

  /**
   * ============================================
   * 1️⃣ CARGAR TOKEN Y USER ID
   * ============================================
   */
  useEffect(() => {
    const authResponse = JSON.parse(
      localStorage.getItem('authResponse') || '{}'
    );
    
    if (authResponse?.accesToken) {
      setToken(authResponse.accesToken);
      setUserID(authResponse.user?.profile?.id || '');
    }
  }, []);

  /**
   * ============================================
   * 2️⃣ OBTENER SALAS PROGRAMADAS
   * Solo salas con start_date !== null
   * ============================================
   */
  useEffect(() => {
    if (!token || hasLoadedRooms.current) return;

    const getRooms = async () => {
      setLoading(true);
      
      try {
        const response = await getAllRoomsEndpoint(token);
        
        // Filtrar SOLO salas programadas (start_date !== null)
        const programmedRooms = response.filter(
          (room: Room) => room.start_date !== null
        );
        
        setRooms(programmedRooms);
        hasLoadedRooms.current = true;
        
        console.log(`✅ ${programmedRooms.length} salas programadas cargadas`);
      } catch (error: any) {
        // Usa tu manejador de errores reutilizable
        // Maneja automáticamente: Token expirado, errores de red, etc.
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [token, logout]);

  /**
   * ============================================
   * RETORNO DEL HOOK
   * ============================================
   */
  return {
    // Estados
    rooms,
    loading,
    token,
    userID,
    
    // Metadata
    totalRooms: rooms.length,
    hasRooms: rooms.length > 0,
  };
};