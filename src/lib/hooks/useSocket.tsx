// lib/hooks/useSocket.tsx - HOOK OPTIMIZADO
import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/settings/socket';

/**
 * Hook principal para usar Socket.IO en componentes
 * Mantiene una sola instancia y limpia correctamente los listeners
 */
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  const cleanupFnsRef = useRef<Array<() => void>>([]);

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

          // Listeners para actualizar estado de conexión
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

          // Usar el método .on del socketManager que registra internamente
          const cleanupConnect = socketManager.on('connect', handleConnect);
          const cleanupDisconnect = socketManager.on('disconnect', handleDisconnect);

          // Guardar funciones de limpieza
          cleanupFnsRef.current.push(cleanupConnect, cleanupDisconnect);
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
      
      // Ejecutar todas las funciones de limpieza
      cleanupFnsRef.current.forEach(cleanup => cleanup());
      cleanupFnsRef.current = [];
    };
  }, []);

  /**
   * Emite un evento
   */
  const emit = useCallback((event: string, data?: any) => {
    socketManager.emit(event, data);
  }, []);

  /**
   * Escucha un evento (con limpieza automática)
   */
  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    // Usar el método del socketManager que maneja la persistencia
    const cleanup = socketManager.on(event, handler);
    
    return cleanup;
  }, []);

  /**
   * Escucha un evento una sola vez
   */
  const once = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socket?.connected) {
      socket.once(event, handler);
    } else {
      console.warn(`⚠️ Socket no disponible para once "${event}"`);
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

/**
 * Hook especializado para salas con conteo de jugadores
 * Optimizado para no crear listeners duplicados
 */
export const useRoomProfiles = (roomCode: string | null) => {
  const { socket, isConnected, emit, on } = useSocket();
  const [connectedCount, setConnectedCount] = useState<number>(0);
  const [profiles, setProfiles] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const handlerRegisteredRef = useRef(false);

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

    // Registrar listener SOLO UNA VEZ
    if (!handlerRegisteredRef.current) {
      const cleanup = on('connectedProfiles', handleConnectedProfiles);
      handlerRegisteredRef.current = true;

      // Solicitar perfiles inmediatamente
      emit('listConnectedProfiles', { roomCode });

      // Solicitar perfiles cada 10 segundos
      intervalRef.current = setInterval(() => {
        if (isConnected) {
          emit('listConnectedProfiles', { roomCode });
        }
      }, 10000);

      // Cleanup
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        cleanup();
        handlerRegisteredRef.current = false;
      };
    }
  }, [socket, isConnected, roomCode, emit, on]);

  return {
    connectedCount,
    profiles,
  };
};