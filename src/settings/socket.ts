
import { io } from 'socket.io-client';

const socket = io('https://api.backconcursemos.com', {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  timeout: 20000,
  autoConnect: true,

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