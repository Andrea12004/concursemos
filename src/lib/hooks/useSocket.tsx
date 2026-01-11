// src/lib/hooks/useSocket.tsx - CORREGIDO
import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/settings/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // NO inicializar automáticamente, solo obtener si ya existe
    const existingSocket = socketManager.getSocket();
    
    if (existingSocket) {
      setSocket(existingSocket);
      setIsConnected(existingSocket.connected);
      
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

      existingSocket.on('connect', handleConnect);
      existingSocket.on('disconnect', handleDisconnect);

      return () => {
        mountedRef.current = false;
        existingSocket.off('connect', handleConnect);
        existingSocket.off('disconnect', handleDisconnect);
      };
    } else {
      // Si no hay socket, simplemente indicar que no está conectado
      setIsConnected(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn(`⚠️ Socket no disponible para emitir "${event}"`);
    }
  }, [socket]);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, handler);
      
      return () => {
        socket.off(event, handler);
      };
    }
    
    return () => {};
  }, [socket]);

  const once = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socket?.connected) {
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

export const useRoomProfiles = (roomCode: string | null) => {
  const { socket, isConnected, emit, on } = useSocket();
  const [connectedCount, setConnectedCount] = useState<number>(0);
  const [profiles, setProfiles] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo actuar si hay socket Y está conectado Y hay roomCode
    if (!socket || !isConnected || !roomCode) {
      return;
    }

    console.log(`📡 Escuchando perfiles en sala: ${roomCode}`);

    const handleConnectedProfiles = (data: any) => {
      if (data.roomCode === roomCode) {
        const profilesList = data.profiles || [];
        setProfiles(profilesList);
        setConnectedCount(profilesList.length);
      }
    };

    const cleanup = on('connectedProfiles', handleConnectedProfiles);

    // Solicitar perfiles inmediatamente
    emit('listConnectedProfiles', { roomCode });

    // Actualizar cada 10 segundos
    intervalRef.current = setInterval(() => {
      if (isConnected) {
        emit('listConnectedProfiles', { roomCode });
      }
    }, 10000);

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