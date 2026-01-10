// settings/socket.ts - VERSIÓN SIMPLIFICADA
import { socketSingleton } from '@/settings/socket';

// Funciones de interfaz para compatibilidad
export const getSocket = () => socketSingleton.getCurrentSocket();
export const obtenerSocket = () => socketSingleton.getCurrentSocket();

export const connectSocket = async () => {
  console.log('🔌 Conectando socket...');
  return socketSingleton.getSocket();
};

export const disconnectSocket = () => {
  socketSingleton.disconnect();
};

// Exportar por defecto para compatibilidad
export default socketSingleton;