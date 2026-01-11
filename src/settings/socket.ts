// settings/socket.ts - VERSIÓN CORREGIDA FINAL
import { io, Socket } from 'socket.io-client';
import { baseUrl } from './baseUrl';

/**
 * Singleton para gestionar Socket.IO
 * CORRIGE: múltiples conexiones y loops infinitos
 */
class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting = false;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /**
   * Obtiene el token de autenticación
   */
  private getAuthToken(): string | null {
    try {
      const authResponse = localStorage.getItem('authResponse');
      if (!authResponse) return null;

      const parsed = JSON.parse(authResponse);
      return parsed.accesToken || parsed.accessToken || parsed.token || null;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Crea la conexión Socket.IO UNA SOLA VEZ
   */
  private createSocket(): Socket {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🔌 Creando conexión Socket.IO...');

    const newSocket = io(baseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3, // SOLO 3 intentos
      timeout: 10000,
      autoConnect: false, // NO conectar automáticamente
    });

    this.setupSocketListeners(newSocket);
    return newSocket;
  }

  /**
   * Configura los listeners del socket
   */
  private setupSocketListeners(socket: Socket): void {
    socket.on('connect', () => {
      console.log('✅ Socket conectado:', socket.id);
      this.isConnecting = false;
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      this.isConnecting = false;
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconexión fallida - Deteniendo intentos');
      this.isConnecting = false;
      socket.removeAllListeners();
    });
  }

  /**
   * Inicializa el socket SOLO UNA VEZ
   */
  public async initialize(): Promise<Socket> {
    // Si ya está inicializado, retornar
    if (this.isInitialized && this.socket) {
      if (this.socket.connected) {
        return this.socket;
      }
      
      // Si existe pero no está conectado, intentar reconectar
      if (!this.socket.connected && !this.isConnecting) {
        console.log('🔄 Reconectando socket existente...');
        this.socket.connect();
      }
      
      return this.socket;
    }

    // Si ya está conectando, esperar
    if (this.isConnecting) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkInterval);
            resolve(this.socket);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Timeout esperando conexión'));
        }, 10000);
      });
    }

    // Crear nuevo socket
    this.isConnecting = true;

    try {
      this.socket = this.createSocket();
      this.socket.connect(); // Conectar manualmente
      this.isInitialized = true;
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.isConnecting = false;
          reject(new Error('Timeout en conexión inicial'));
        }, 10000);

        this.socket!.once('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          resolve(this.socket!);
        });

        this.socket!.once('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          reject(error);
        });
      });
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Obtiene el socket (SIN inicializar si no existe)
   */
  public getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Verifica si está conectado
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Emite un evento
   */
  public emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Socket no conectado, no se puede emitir "${event}"`);
    }
  }

  /**
   * Escucha un evento
   */
  public on(event: string, handler: Function): () => void {
    if (this.socket) {
      this.socket.on(event, handler as any);
      
      return () => {
        this.socket?.off(event, handler as any);
      };
    }
    
    return () => {};
  }

  /**
   * Desconecta el socket completamente
   */
  public disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando socket...');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.isInitialized = false;
    }
  }
}

// Exportar instancia única
export const socketManager = SocketManager.getInstance();