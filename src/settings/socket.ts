// src/settings/socket.ts - CONFIGURACIÓN FINAL CORREGIDA
import { io } from 'socket.io-client';

/**
 * Socket.IO Client - Configuración Correcta
 * 
 * El backend responde correctamente en:
 * https://api.backconcursemos.com/socket.io/
 * 
 * Verificado con respuesta:
 * {"sid":"jQlfQD92ITOCzBfMAAGv","upgrades":["websocket"],...}
 */

const socket = io('https://api.backconcursemos.com', {
  transports: ['polling', 'websocket'], // ⭐ ORDEN IMPORTANTE: polling primero
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  timeout: 20000,
  autoConnect: true,
  withCredentials: true, // ⭐ AGREGAR ESTO para CORS
});

// Logs de debugging
socket.on('connect', () => {
  console.log('✅ Socket conectado:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('🔴 Socket desconectado:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Error de conexión:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Reconectado después de', attemptNumber, 'intentos');
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('🔄 Intento de reconexión #', attemptNumber);
});

socket.on('reconnect_error', (error) => {
  console.error('❌ Error de reconexión:', error.message);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Reconexión fallida después de todos los intentos');
});

// Exportar el socket
export default socket;

// Helpers
export const isSocketConnected = (): boolean => socket.connected;
export const getSocketId = (): string | undefined => socket.id;
export const disconnectSocket = (): void => {
  if (socket.connected) {
    console.log('🔌 Desconectando socket...');
    socket.disconnect();
  }
};
export const reconnectSocket = (): void => {
  if (!socket.connected) {
    console.log('🔌 Reconectando socket...');
    socket.connect();
  }
};