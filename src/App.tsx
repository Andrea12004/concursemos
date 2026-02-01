import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import SendReset from "@/pages/sendreset";
import Registro from "@/pages/Register";
import Reset from "@/pages/reset";
import Dashboard from "@/pages/dashboard";
import Partida from "@/pages/Departure";
import { Salas } from "@/pages/Room";
import Banco from "@/pages/questionBank";
import Usuarios from "@/pages/user";
import Categorias from "@/pages/Category";
import Pagos from "@/pages/Pay";
import Perfil from "@/pages/Profile";
import CrearPartida from "@/pages/createGame";

import { useAuthInit } from "@/lib/services/Redux/Useauthinit";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("cnrsms_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  useAuthInit();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/enviar-restablecimiento" element={<SendReset />} />
      <Route path="/restablecer" element={<Reset />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sala/:id"
        element={
          <ProtectedRoute>
            <Partida />
          </ProtectedRoute>
        }
      />

      <Route
        path="/salas"
        element={
          <ProtectedRoute>
            <Salas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/banco"
        element={
          <ProtectedRoute>
            <Banco />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categorias"
        element={
          <ProtectedRoute>
            <Categorias />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pagos"
        element={
          <ProtectedRoute>
            <Pagos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/crear-partida"
        element={
          <ProtectedRoute>
            <CrearPartida />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
