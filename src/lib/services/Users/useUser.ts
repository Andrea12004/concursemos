import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import socket from "@/settings/socket";
import { getAllProfilesEndpoint } from "@/lib/api/profile";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import type { User } from "@/lib/types/user";
import { useAuthData } from "@/lib/hooks/useAuthData";

interface SocketMessage {
  total: number;
}

export const useUsuariosLogic = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user: authUser, profile: authProfile, isAuthenticated } = useAuthData();

  const token = useMemo(() => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      ''
    );
  }, []);

  const admin = useMemo(() => authUser?.role === 'ADMIN', [authUser?.role]);
  
  // ✅ CRÍTICO: Obtener profileId desde Redux
  const profileId = useMemo(() => 
    authProfile?.id || authUser?.profile?.id || '', 
    [authProfile?.id, authUser?.profile?.id]
  );
  
  const [users, setUsers] = useState<User[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    const tokenAvailable = !!(localStorage.getItem('authToken') || localStorage.getItem('cnrsms_token'));
    if (!isAuthenticated && !tokenAvailable) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // ✅ Petición de usuarios (corregida sin bucle)
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);
      
      try {
        const response = await getAllProfilesEndpoint(token);
        
        if (cancelled) return;
        
        setUsers(response);
      } catch (error: any) {
        if (cancelled) return;
        
        console.error("Error al obtener usuarios:", error);

        if (error.response?.data?.message === "Token expirado") {
          await showAlert(
            "Inicio de sesión expirado",
            "Vuelve a ingresar a la plataforma",
            "error"
          );
          logout();
          return;
        }

        showAlert(
          "Error",
          "Estamos teniendo fallas técnicas al cargar usuarios",
          "error"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  // ✅ SOCKET.IO: Debugging y obtener usuarios conectados
  useEffect(() => {
    // 🔍 DEBUG: Verificar conexión del socket
    const handleConnect = () => {
      console.log('✅ Socket conectado:', socket.id);
    };

    const handleDisconnect = () => {
      console.log('❌ Socket desconectado');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // 🔍 DEBUG: Ver TODOS los eventos que recibe el socket
    socket.onAny((eventName, ...args) => {
      console.log('📨 Socket recibió evento:', eventName, args);
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.offAny();
    };
  }, []);

  // ✅ SOCKET.IO: Obtener usuarios conectados (CORREGIDO)
  useEffect(() => {
    if (!token || !admin || !profileId) {
      console.log('⚠️ Socket NO iniciado:', {
        token: !!token,
        admin,
        profileId,
        socketConnected: socket.connected
      });
      return;
    }

    console.log('🔌 Iniciando socket para admin:', {
      profileId,
      socketId: socket.id,
      connected: socket.connected
    });

    const fetchConnectedUsers = () => {
      console.log('📤 Emitiendo totalConnectedUsers con:', { profileId });
      
      socket.emit("totalConnectedUsers", { 
        profileId // ✅ CRÍTICO: Enviar profileId
      });
    };

    const handleTotalUsersOnline = (message: SocketMessage) => {
      console.log('👥 Total usuarios conectados:', message.total);
      setConnectedUsers(message.total);
    };

    // Registrar listener
    socket.on("totalUsersOnline", handleTotalUsersOnline);

    // Emitir inmediatamente la primera vez
    fetchConnectedUsers();

    // Configurar intervalo para actualizar cada 5 segundos
    const interval = setInterval(fetchConnectedUsers, 5000);

    // Cleanup: remover listener y limpiar intervalo
    return () => {
      console.log('🧹 Limpiando socket listeners');
      clearInterval(interval);
      socket.off("totalUsersOnline", handleTotalUsersOnline);
    };
  }, [token, admin, profileId]); // ✅ CRÍTICO: Añadir profileId

  return {
    searchQuery,
    setSearchQuery,
    admin,
    loading,
    users,
    connectedUsers
  };
};