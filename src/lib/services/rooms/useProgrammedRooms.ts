
import { useState, useEffect, useRef } from 'react';
import { getAllRoomsEndpoint } from '@/lib/api/rooms';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';
import { useAuthData } from '@/lib/hooks/useAuthData';

interface Room {
  id: string;
  room_name: string;
  room_code: string;
  start_date: string | null;
  start_time?: string;
  state: string;
  [key: string]: any;
}

export const useProgrammedRooms = () => {
  const { logout } = useLogout();
  const { profileId: userID } = useAuthData();
  
  // Estados
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar múltiples llamadas
  const hasLoadedRooms = useRef(false);

 
  useEffect(() => {
    if (hasLoadedRooms.current) return;

    const getRooms = async () => {
      setLoading(true);
      
      try {
        // ⭐ CORREGIDO: Obtener token directamente
        const token = localStorage.getItem('authToken') || 
                     localStorage.getItem('cnrsms_token');
        
        if (!token) {

          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        const response = await getAllRoomsEndpoint(token);
        
        // Filtrar SOLO salas programadas (start_date !== null)
        const programmedRooms = response.filter(
          (room: Room) => room.start_date !== null
        );
        
        setRooms(programmedRooms);
        hasLoadedRooms.current = true;
        setError(null);
        

      } catch (error: any) {

        setError('Error al cargar las salas programadas');
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [logout]);

  /**
   * Función para recargar salas manualmente
   */
  const refetchRooms = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('cnrsms_token');
      
      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      const response = await getAllRoomsEndpoint(token);
      
      const programmedRooms = response.filter(
        (room: Room) => room.start_date !== null
      );
      
      setRooms(programmedRooms);
      hasLoadedRooms.current = true;
      setError(null);
      

    } catch (error: any) {

      setError('Error al recargar las salas programadas');
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ============================================
   * RETORNO DEL HOOK
   * ============================================
   */
  return {
    // Estados
    rooms,
    loading,
    error,
    
    userID,
    
    totalRooms: rooms.length,
    hasRooms: rooms.length > 0,
    
    refetchRooms,
  };
};
