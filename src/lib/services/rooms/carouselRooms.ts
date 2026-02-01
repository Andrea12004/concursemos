
import { useState, useEffect, useMemo, useRef } from 'react';
import { getAllRoomsEndpoint } from '@/lib/api/rooms';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';


export interface ScheduledRoom {
  id: string;
  room_name: string;
  room_code: string;
  max_user: number;
  number_questions: number;
  time_question: number;
  start_date: string | null;
  state: string;
  invitedProfiles: any[];
}

export const scheduledRoomsService = {
  
  async getScheduledRooms(token: string): Promise<ScheduledRoom[]> {
    const allRooms = await getAllRoomsEndpoint(token);
    
    return allRooms.filter((room: ScheduledRoom) => 
      room.start_date !== null && 
      room.state !== 'FINALIZADA' && 
      room.state !== 'JUGANDO'
    );
  },

  filterByName(rooms: ScheduledRoom[], searchQuery: string): ScheduledRoom[] {
    if (!searchQuery.trim()) return rooms;
    
    const query = searchQuery.toLowerCase();
    return rooms.filter(room =>
      room.room_name.toLowerCase().includes(query)
    );
  },

  getPlayerCount(room: ScheduledRoom): number {
    return (room.invitedProfiles?.length || 0) + 1;
  }
};

export const useScheduledRooms = (searchQuery = '') => {
  const { logout } = useLogout();
  
  const [rooms, setRooms] = useState<ScheduledRoom[]>([]);
  const [loading, setLoading] = useState(true);
  
  const hasLoadedRooms = useRef(false);

  const filteredRooms = useMemo(() => {
    return scheduledRoomsService.filterByName(rooms, searchQuery);
  }, [rooms, searchQuery]);

  useEffect(() => {
    if (hasLoadedRooms.current) return;

    const loadRooms = async () => {
      try {
    
        const token = localStorage.getItem('authToken') || 
                     localStorage.getItem('cnrsms_token');
        
        if (!token) {
          
          setLoading(false);
          return;
        }
        
        const data = await scheduledRoomsService.getScheduledRooms(token);
        
        setRooms(data);
        hasLoadedRooms.current = true;

      } catch (error) {
        handleAxiosError(error, logout);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [logout]);

  return {
    rooms: filteredRooms,
    loading,
    totalRooms: rooms.length,
  };
};
