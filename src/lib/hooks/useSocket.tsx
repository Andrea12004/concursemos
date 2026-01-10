// lib/hooks/useSocket.ts - HOOK PARA USAR SOCKET EN COMPONENTES
import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/settings/socket';

/**
 * Hook para usar Socket.IO en componentes React
 * Maneja la conexión automática y limpieza de listeners
 */
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let currentSocket: Socket | null = null;

    const initSocket = async () => {
      try {
        currentSocket = await socketManager.getSocket();
        
        if (mountedRef.current) {
          setSocket(currentSocket);
          setIsConnected(currentSocket.connected);
          setError(null);

          // Actualizar estado cuando cambie la conexión
          const handleConnect = () => {
            if (mountedRef.current) {
              setIsConnected(true);
            }
          };

          const handleDisconnect = () => {
            if (mountedRef.current) {
              setIsConnected(false);
            }
          };

          currentSocket.on('connect', handleConnect);
          currentSocket.on('disconnect', handleDisconnect);

          // Cleanup de estos listeners específicos
          return () => {
            currentSocket?.off('connect', handleConnect);
            currentSocket?.off('disconnect', handleDisconnect);
          };
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          console.error('❌ Error inicializando socket:', err);
        }
      }
    };

    initSocket();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Función helper para emitir eventos
   */
  const emit = useCallback((event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn(`⚠️ No se puede emitir "${event}": socket no conectado`);
    }
  }, [socket, isConnected]);

  /**
   * Función helper para escuchar eventos
   * Retorna función de limpieza
   */
  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, handler);
      return () => socket.off(event, handler);
    }
    return () => {};
  }, [socket]);

  /**
   * Función helper para escuchar evento una sola vez
   */
  const once = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socket) {
      socket.once(event, handler);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    error,
    emit,
    on,
    once,
  };
};

// Hook especializado para listar perfiles conectados en una sala
export const useRoomProfiles = (roomCode: string | null) => {
  const { socket, isConnected, emit, on } = useSocket();
  const [connectedCount, setConnectedCount] = useState<number>(0);
  const [profiles, setProfiles] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !roomCode) {
      return;
    }

    console.log(`📡 Configurando listeners para sala: ${roomCode}`);

    // Handler para respuesta de perfiles
    const handleConnectedProfiles = (data: any) => {
      if (data.roomCode === roomCode) {
        const profilesList = data.profiles || [];
        setProfiles(profilesList);
        setConnectedCount(profilesList.length);
        console.log(`👥 ${profilesList.length} jugadores en sala ${roomCode}`);
      }
    };

    // Registrar listener
    const cleanup = on('connectedProfiles', handleConnectedProfiles);

    // Solicitar perfiles inmediatamente
    emit('listConnectedProfiles', { roomCode });

    // Solicitar perfiles cada 10 segundos
    intervalRef.current = setInterval(() => {
      emit('listConnectedProfiles', { roomCode });
    }, 10000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      cleanup();
    };
  }, [socket, isConnected, roomCode, emit, on]);

  return {
    connectedCount,
    profiles,
  };
};