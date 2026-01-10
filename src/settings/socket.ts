// settings/SocketSingleton.ts
import { io, Socket } from 'socket.io-client';
import { baseUrl } from './baseUrl';

class SocketSingleton {
  private static instance: SocketSingleton;
  private socket: Socket | null = null;
  private connectionPromise: Promise<Socket | null> | null = null;
  private isInitializing = false;

  private constructor() {
    // Constructor privado para Singleton
  }

  static getInstance(): SocketSingleton {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton();
    }
    return SocketSingleton.instance;
  }

  private getToken(): string | null {
    try {
      const auth = localStorage.getItem('authResponse');
      if (!auth) return null;
      
      const authData = JSON.parse(auth);
      return authData.token || authData.accessToken || authData.accesToken;
    } catch {
      return null;
    }
  }

  async getSocket(): Promise<Socket | null> {
    // Si ya está conectado, devolverlo
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // Si ya está en proceso de conexión, devolver la promesa existente
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Si está inicializando, esperar
    if (this.isInitializing) {
      return new Promise(resolve => {
        setTimeout(() => resolve(this.getSocket()), 100);
      });
    }

    // Crear nueva conexión
    this.isInitializing = true;
    this.connectionPromise = this.createSocket();
    
    const socket = await this.connectionPromise;
    this.connectionPromise = null;
    this.isInitializing = false;
    
    return socket;
  }

  private async createSocket(): Promise<Socket | null> {
    const token = this.getToken();
    if (!token) {
      console.warn('❌ No hay token para conectar socket');
      return null;
    }

    // Limpiar socket anterior si existe
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    console.log('🔌 Creando conexión Socket.IO...');
    
    try {
      this.socket = io(baseUrl, {
        auth: { token },
        transports: ['websocket'],
        reconnection: false, // Desactivar reconexión automática
        timeout: 10000,
      });

      // Configurar eventos básicos
      this.socket.on('connect', () => {
        console.log('✅ Socket conectado:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket desconectado:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión:', error.message);
      });

      // Esperar conexión con timeout
      return await new Promise<Socket | null>((resolve) => {
        if (!this.socket) return resolve(null);

        const timeout = setTimeout(() => {
          console.warn('⏰ Timeout en conexión socket');
          resolve(this.socket);
        }, 5000);

        this.socket.once('connect', () => {
          clearTimeout(timeout);
          resolve(this.socket);
        });

        this.socket.once('connect_error', () => {
          clearTimeout(timeout);
          resolve(null);
        });
      });

    } catch (error) {
      console.error('❌ Error creando socket:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Desconectando socket...');
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionPromise = null;
    this.isInitializing = false;
  }

  getCurrentSocket(): Socket | null {
    return this.socket?.connected ? this.socket : null;
  }
}

// Exportar instancia única
export const socketSingleton = SocketSingleton.getInstance();