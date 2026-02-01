import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import socket from "@/settings/socket";
import type { User } from "@/lib/types/user";
import { useAuthData } from "@/lib/hooks/useAuthData";

interface SocketMessage {
  total: number;
}

export const useUsuariosLogic = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { user: authUser, isAuthenticated } = useAuthData();

  const token = useMemo(() => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      ''
    );
  }, []);

  const admin = useMemo(() => authUser?.role === 'ADMIN', [authUser?.role]);
  const [connectedUsers, setConnectedUsers] = useState<number>(0);
  const navigate = useNavigate();


  // Si no hay usuario en Redux, redirigir al login
  useEffect(() => {
    const tokenAvailable = !!(localStorage.getItem('authToken') || localStorage.getItem('cnrsms_token'));
    if (!isAuthenticated && !tokenAvailable) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Socket.IO: Obtener usuarios conectados (solo para ADMIN)
  useEffect(() => {
    if (!token || !admin) return;

    const fetchConnectedUsers = () => {
      socket.emit("totalConnectedUsers", {});
    };

    const handleTotalUsersOnline = (message: SocketMessage) => {

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

      clearInterval(interval);
      socket.off("totalUsersOnline", handleTotalUsersOnline);
    };
  }, [token, admin]);

  return {
    searchQuery,
    setSearchQuery,
    admin,
    users: [] as User[], 
    connectedUsers
  };
};