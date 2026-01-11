// src/plugins/SocketContext.ts - Socket Global Simple
import { io, Socket } from 'socket.io-client';
import { baseUrl } from './baseUrl';

/**
 * Socket.IO Client Global
 * 
 * Instancia única del socket que se conecta automáticamente al servidor.
 * Sigue el patrón simple del proyecto original pero con TypeScript.
 * 
 * CARACTERÍSTICAS:
 * - Conexión automática al importar
 * - Reconexión automática configurada
 * - Logging para debugging
 * - Type-safe con TypeScript
 * 
 * USO:
 * ```typescript
 * import socket from '@/plugins/SocketContext';
 * 
 * // Emitir evento
 * socket.emit('listConnectedProfiles', { roomCode: 'ABC123' });
 * 
 * // Escuchar evento
 * socket.on('connectedProfiles', (data) => {
 *   console.log('Jugadores:', data.profiles.length);
 * });
 * 
 * // Limpiar listener
 * socket.off('connectedProfiles', handler);
 * ```
 */

// Crear instancia del socket
const socket: Socket = io(baseUrl, {
  // Transportes: WebSocket primero, polling como fallback
  transports: ['websocket', 'polling'],
  
  // Reconexión automática
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  
  // Timeout de conexión
  timeout: 20000,
  
  // Auto-conectar al crear instancia
  autoConnect: true,
});

/**
 * Listeners de eventos del socket para debugging
 * (Opcional - puedes comentarlos en producción)
 */

// Conexión exitosa
socket.on('connect', () => {
  console.log('🟢 Socket conectado');
  console.log('   Socket ID:', socket.id);
  console.log('   Transport:', socket.io.engine.transport.name);
});

// Desconexión
socket.on('disconnect', (reason) => {
  console.log('🔴 Socket desconectado');
  console.log('   Razón:', reason);
  
  // Si el servidor cerró la conexión, intentar reconectar
  if (reason === 'io server disconnect') {
    console.log('🔄 Reconectando...');
    socket.connect();
  }
});

// Error de conexión
socket.on('connect_error', (error) => {
  console.error('❌ Error de conexión');
  console.error('   Mensaje:', error.message);
});

// Intento de reconexión
socket.io.on('reconnect_attempt', (attempt) => {
  console.log(`🔄 Intento de reconexión ${attempt}...`);
});

// Reconexión exitosa
socket.io.on('reconnect', (attempt) => {
  console.log(`✅ Reconectado después de ${attempt} intentos`);
});

// Reconexión fallida
socket.io.on('reconnect_failed', () => {
  console.error('❌ Reconexión fallida después de todos los intentos');
});

// Upgrade de transport (de polling a websocket)
socket.io.engine.on('upgrade', (transport) => {
  console.log('🔄 Transport actualizado a:', transport.name);
});

/**
 * Exportar la instancia del socket
 * Esta es la única instancia que existirá en toda la aplicación
 */
export default socket;

/**
 * Helper: Verificar si el socket está conectado
 */
export const isSocketConnected = (): boolean => {
  return socket.connected;
};

/**
 * Helper: Obtener el ID del socket
 */
export const getSocketId = (): string | undefined => {
  return socket.id;
};

/**
 * Helper: Desconectar manualmente el socket
 * Útil para logout
 */
export const disconnectSocket = (): void => {
  if (socket.connected) {
    console.log('🔌 Desconectando socket manualmente...');
    socket.disconnect();
  }
};

/**
 * Helper: Reconectar manualmente el socket
 */
export const reconnectSocket = (): void => {
  if (!socket.connected) {
    console.log('🔌 Reconectando socket manualmente...');
    socket.connect();
  }
};