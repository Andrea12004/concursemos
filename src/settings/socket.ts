// src/settings/socket.ts - ULTRA SEGURO
import { io, Socket } from 'socket.io-client';
import { baseUrl } from './baseUrl';

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnecting = false;
  private isInitialized = false;
  private connectionAttempts = 0;
  private maxAttempts = 3;

  private constructor() {
    console.log('🏗️ SocketManager creado');
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  private getAuthToken(): string | null {
    try {
      const authResponse = localStorage.getItem('authResponse');
      if (!authResponse) {
        console.warn('⚠️ No hay authResponse en localStorage');
        return null;
      }

      const parsed = JSON.parse(authResponse);
      const token = parsed.accesToken || parsed.accessToken || parsed.token;
      
      if (!token) {
        console.warn('⚠️ No se encontró token en authResponse');
        return null;
      }
      
      console.log('🔑 Token encontrado:', token.substring(0, 15) + '...');
      return token;
    } catch (error) {
      console.error('❌ Error parseando authResponse:', error);
      return null;
    }
  }

  private createSocket(): Socket {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('❌ No hay token de autenticación disponible');
    }

    console.log('🔌 Creando conexión Socket.IO a:', baseUrl);

    const newSocket = io(baseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxAttempts,
      timeout: 20000, // Aumentado a 20 segundos
      autoConnect: false,
      forceNew: true, // Forzar nueva conexión
    });

    this.setupSocketListeners(newSocket);
    return newSocket;
  }

  private setupSocketListeners(socket: Socket): void {
    socket.on('connect', () => {
      console.log('✅ Socket CONECTADO exitosamente!');
      console.log('   Socket ID:', socket.id);
      console.log('   Transport:', socket.io.engine.transport.name);
      this.isConnecting = false;
      this.connectionAttempts = 0;
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado. Razón:', reason);
      
      if (reason === 'io server disconnect') {
        console.log('🔄 Servidor cerró la conexión, intentando reconectar...');
        setTimeout(() => {
          if (socket && !socket.connected) {
            socket.connect();
          }
        }, 1000);
      }
    });

    socket.on('connect_error', (error) => {
      this.connectionAttempts++;
      console.error(`❌ Error de conexión (${this.connectionAttempts}/${this.maxAttempts})`);
      console.error('   Mensaje:', error.message);
      console.error('   Tipo:', error);
      
      this.isConnecting = false;
      
      if (this.connectionAttempts >= this.maxAttempts) {
        console.error('❌ MÁXIMO DE INTENTOS ALCANZADO');
        console.error('   Verifica:');
        console.error('   1. Que el servidor esté corriendo en:', baseUrl);
        console.error('   2. Que el token sea válido');
        console.error('   3. Que el backend acepte conexiones Socket.IO');
        socket.removeAllListeners();
      }
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Intento de reconexión ${attempt}...`);
    });

    socket.on('reconnect', (attempt) => {
      console.log(`✅ Reconectado después de ${attempt} intentos`);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Reconexión FALLIDA después de todos los intentos');
      this.isConnecting = false;
      socket.removeAllListeners();
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error general:', error);
    });

    // Listener para debugging de transport
    socket.io.engine.on('upgrade', (transport) => {
      console.log('🔄 Transport actualizado a:', transport.name);
    });
  }

  public async initialize(): Promise<Socket> {
    console.log('🚀 Iniciando inicialización de socket...');
    console.log('   Estado actual:');
    console.log('   - isInitialized:', this.isInitialized);
    console.log('   - isConnecting:', this.isConnecting);
    console.log('   - socket existe:', !!this.socket);
    console.log('   - socket conectado:', this.socket?.connected);

    // Si ya existe y está conectado
    if (this.isInitialized && this.socket?.connected) {
      console.log('♻️ Socket ya inicializado y conectado');
      return this.socket;
    }

    // Si existe pero no está conectado
    if (this.isInitialized && this.socket && !this.socket.connected) {
      console.log('🔄 Socket existe pero no está conectado, reconectando...');
      if (!this.isConnecting) {
        this.isConnecting = true;
        this.socket.connect();
      }
      return this.socket;
    }

    // Si ya está conectando, esperar
    if (this.isConnecting) {
      console.log('⏳ Ya hay una conexión en progreso, esperando...');
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkInterval);
            console.log('✅ Conexión completada mientras esperábamos');
            resolve(this.socket);
          } else if (Date.now() - startTime > 15000) {
            clearInterval(checkInterval);
            reject(new Error('Timeout esperando conexión'));
          }
        }, 200);
      });
    }

    // Crear nuevo socket
    console.log('🆕 Creando nuevo socket...');
    this.isConnecting = true;
    this.connectionAttempts = 0;

    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No se puede crear socket sin token');
      }

      this.socket = this.createSocket();
      
      console.log('📡 Intentando conectar...');
      this.socket.connect();
      
      this.isInitialized = true;
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.isConnecting = false;
          console.error('⏱️ Timeout en conexión inicial (20 segundos)');
          reject(new Error('Timeout en conexión inicial'));
        }, 20000);

        this.socket!.once('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.log('🎉 Conexión inicial EXITOSA');
          resolve(this.socket!);
        });

        this.socket!.once('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.error('❌ Error en conexión inicial:', error.message);
          reject(error);
        });
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('❌ Error crítico inicializando socket:', error);
      throw error;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      console.log(`📤 Emitido evento: ${event}`);
    } else {
      console.warn(`⚠️ No se puede emitir "${event}" - socket no conectado`);
    }
  }

  public on(event: string, handler: Function): () => void {
    if (this.socket) {
      this.socket.on(event, handler as any);
      console.log(`👂 Escuchando evento: ${event}`);
      
      return () => {
        this.socket?.off(event, handler as any);
        console.log(`🔇 Detenido listener: ${event}`);
      };
    }
    
    console.warn(`⚠️ No se puede escuchar "${event}" - socket no disponible`);
    return () => {};
  }

  public disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando socket...');
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.isInitialized = false;
      this.connectionAttempts = 0;
      console.log('✅ Socket desconectado y limpiado');
    }
  }

  public reset(): void {
    console.log('🔄 Reseteando socket manager...');
    this.disconnect();
  }

  public getStatus(): object {
    return {
      initialized: this.isInitialized,
      connecting: this.isConnecting,
      connected: this.socket?.connected ?? false,
      socketId: this.socket?.id ?? null,
      attempts: this.connectionAttempts,
    };
  }
}

export const socketManager = SocketManager.getInstance();