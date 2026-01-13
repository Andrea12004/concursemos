import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "@/settings/socket";
import { getAllProfilesEndpoint } from "@/lib/api/profile";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import type { User } from "@/lib/types/user";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import HeaderUsers from "@/components/Users/headerUsers";
import TableUsers from "@/components/Users/tableUsers";
import TableRanking from "@/components/Users/tableRanking";
import "@/components/Users/css/user.css";

interface AuthResponse {
  accesToken: string;
  user: {
    id: string | number;
    role: 'ADMIN' | 'BASIC';
    profile: {
      id: string | number;
    };
  };
}

interface SocketMessage {
  total: number;
}

export const Usuarios = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string | number>("");
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { logout } = useLogout();

  // Cargar datos de autenticación del localStorage
  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem("authResponse");
      if (authResponseStr) {
        const parsedAuthResponse: AuthResponse = JSON.parse(authResponseStr);
        setToken(parsedAuthResponse.accesToken);
        setUserID(parsedAuthResponse.user.profile.id);
        setUser(parsedAuthResponse.user);
        
        if (parsedAuthResponse.user && parsedAuthResponse.user.role === "ADMIN") {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      } else {
        // Si no hay datos de autenticación, redirigir al login
        navigate("/");
      }
    } catch (error) {
      console.error("Error al cargar datos de autenticación:", error);
      navigate("/");
    }
  }, [navigate]);

  // Función para traer usuarios desde la API
  const getUsers = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllProfilesEndpoint(token);
      setUsers(response);
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);

      // Manejar token expirado
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
      setLoading(false);
    }
  };

  // Cargar usuarios cuando el token esté disponible
  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  // Socket.IO: Obtener usuarios conectados (solo para ADMIN)
  useEffect(() => {
    if (!token || !admin) return;

    console.log("🔌 Configurando listeners de usuarios conectados...");

    const fetchConnectedUsers = () => {
      console.log("📡 Solicitando total de usuarios conectados...");
      socket.emit("totalConnectedUsers", {});
    };

    const handleTotalUsersOnline = (message: SocketMessage) => {
      console.log("👥 Usuarios conectados recibidos:", message);
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
      console.log("🧹 Limpiando listeners de usuarios conectados...");
      clearInterval(interval);
      socket.off("totalUsersOnline", handleTotalUsersOnline);
    };
  }, [token, admin]);

  // Mostrar loader mientras carga
  if (loading) {
    return (
      <div className="all-dashboard">
        <Sidebar />
        <div className="content-dashboard">
          <div className="flex justify-center items-center h-screen">
            <p className="text-white text-xl">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-dashboard">
      <Sidebar />

      <div className="content-dashboard">
        {/*HEADER*/}
        {admin ? (
          <HeaderUsers setSearchQuery={setSearchQuery} />
        ) : (
          <Header setSearchQuery={setSearchQuery} />
        )}
        {/*HEADER*/}

        {/*CONTENT*/}
        <div className="flex justify-between h3-content-perfil !w-[97%]">
          <h3 className="h3-content-perfil gap-2">
            {admin ? "Usuarios" : "Ranking de Jugadores"}{" "}
            <span className="textos-peques gris pt-3">({users.length})</span>
          </h3>
          {admin && (
            <h3 className="h3-content-perfil_2 gap-2">
              Usuarios Conectados{" "}
              <span className="textos-peques gris pt-3">({connectedUsers})</span>
            </h3>
          )}
        </div>

        <div className="content-usuarios">
          {admin ? (
            <TableUsers searchQuery={searchQuery} />
          ) : (
            <TableRanking searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;