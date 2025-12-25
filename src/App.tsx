import { useEffect } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { disconnectSocket } from "@/settings/socket";
import useAuth from "@/lib/hooks/useAuth";
import Login from "@/pages/login";
import SendReset from "@/pages/sendreset";
import Registro from "@/pages/registro";
import Reset from '@/pages/reset';
import Dashboard from '@/pages/dashboard';
import CrearPartida from '@/pages/crear-partida';
import Perfil from '@/pages/perfil';
import Pagos from '@/pages/pagos';
import Salas from '@/pages/salas';
import Banco from '@/pages/banco';
import Categorias from '@/pages/categorias';
import Usuarios from '@/pages/usuarios';
import Partida from '@/pages/partida';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();

  if (auth === null) return <Navigate to="/" />;
  return children;
};

function App() {
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {
    if (!auth) return;

    const handleDisconnect = () => {
      disconnectSocket();
    };

    window.addEventListener("beforeunload", handleDisconnect);

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      handleDisconnect();
    };
  }, [auth, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/enviar-restablecimiento" element={<SendReset />} />
      <Route path="/restablecer" element={<Reset />} />
      <Route path="/crear-partida" element={<CrearPartida />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/pagos" element={<Pagos/>} />
      <Route path="/salas" element={<Salas />} />
      <Route path="/banco" element={<Banco/>} />
      <Route path="/categorias" element={<Categorias/>} />
      <Route path="/usuarios" element={<Usuarios/>} />
      <Route path="/sala/:id" element={<Partida/>} />

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
