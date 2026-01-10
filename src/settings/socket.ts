// settings/socket.ts - CONFIGURACIÓN PROFESIONAL SOCKET.IO
import { io, Socket } from 'socket.io-client';
import { baseUrl } from './baseUrl';

/**
 * Singleton para gestionar una única instancia de Socket.IO en toda la aplicación
 * Garantiza conexión persistente entre recargas y cambios de ruta
 */
class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting = false;
  private connectionAttempts = 0;
  private readonly MAX_ATTEMPTS = 3;

  private constructor() {
    // Constructor privado para patrón Singleton
  }

  /**
   * Obtiene la instancia única del SocketManager
   */
  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /**
   * Extrae el token de autenticación del localStorage
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
   * Crea y configura la conexión Socket.IO
   */
  private createSocketConnection(): Socket {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    console.log('🔌 Creando nueva conexión Socket.IO...');

    // Crear socket con configuración optimizada
    const newSocket = io(baseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'], // websocket primero, fallback a polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
      forceNew: false, // Reutilizar conexión existente si es posible
      autoConnect: true,
    });

    // Configurar event listeners
    this.setupSocketListeners(newSocket);

    return newSocket;
  }

  /**
   * Configura los listeners de eventos del socket
   */
  private setupSocketListeners(socket: Socket): void {
    socket.on('connect', () => {
      console.log('✅ Socket conectado exitosamente:', socket.id);
      this.connectionAttempts = 0;
      this.isConnecting = false;
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado:', reason);
      
      // Si fue desconexión del servidor, intentar reconectar
      if (reason === 'io server disconnect') {
        console.log('🔄 Reconectando manualmente...');
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error.message);
      this.connectionAttempts++;
      
      if (this.connectionAttempts >= this.MAX_ATTEMPTS) {
        console.error('❌ Máximo de intentos de conexión alcanzado');
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconectado después de ${attemptNumber} intentos`);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Intento de reconexión #${attemptNumber}`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('❌ Error en reconexión:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconexión fallida después de todos los intentos');
    });
  }

  /**
   * Obtiene el socket activo o crea uno nuevo si no existe
   * Esta es la función principal que debes usar en tu aplicación
   */
  public async getSocket(): Promise<Socket> {
    // Si ya existe un socket conectado, devolverlo
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // Si existe pero está desconectado, intentar reconectar
    if (this.socket && !this.socket.connected) {
      console.log('🔄 Socket existe pero está desconectado, reconectando...');
      this.socket.connect();
      
      // Esperar hasta que se conecte (con timeout)
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout esperando conexión'));
        }, 5000);

        this.socket!.once('connect', () => {
          clearTimeout(timeout);
          resolve(this.socket!);
        });

        this.socket!.once('connect_error', () => {
          clearTimeout(timeout);
          reject(new Error('Error en conexión'));
        });
      });
    }

    // Si no hay socket, crear uno nuevo
    if (this.isConnecting) {
      // Si ya está en proceso de conexión, esperar
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.socket && this.socket.connected) {
            clearInterval(checkInterval);
            resolve(this.socket);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Timeout esperando socket'));
        }, 10000);
      });
    }

    this.isConnecting = true;

    try {
      this.socket = this.createSocketConnection();
      
      // Esperar a que se conecte
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
   * Devuelve el socket actual sin intentar conectar
   * Útil para verificaciones rápidas
   */
  public getCurrentSocket(): Socket | null {
    return this.socket?.connected ? this.socket : null;
  }

  /**
   * Verifica si el socket está conectado
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Desconecta el socket completamente
   * Solo usar en logout o cierre de aplicación
   */
  public disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando socket manualmente...');
      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket = null;
      this.isConnecting = false;
      this.connectionAttempts = 0;
    }
  }

  /**
   * Reconecta el socket con nuevo token (útil después de login)
   */
  public async reconnectWithNewToken(): Promise<Socket> {
    console.log('🔄 Reconectando con nuevo token...');
    this.disconnect();
    return this.getSocket();
  }
}

// Exportar instancia única
export const socketManager = SocketManager.getInstance();

// Exportar funciones de conveniencia para mantener compatibilidad
export const getSocket = () => socketManager.getSocket();
export const getCurrentSocket = () => socketManager.getCurrentSocket();
export const isSocketConnected = () => socketManager.isConnected();
export const disconnectSocket = () => socketManager.disconnect();
export const connectSocket = () => socketManager.getSocket();