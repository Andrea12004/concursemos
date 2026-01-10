// App.tsx - VERSIÓN CORREGIDA
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import SendReset from "@/pages/sendreset";
import Registro from "@/pages/Register";
import Reset from "@/pages/reset";
import Dashboard from "@/pages/dashboard";
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '@/lib/hooks/useSocket';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authString = localStorage.getItem("authResponse");
  
  if (!authString) {
    return <Navigate to="/" replace />;
  }

  try {
    const authResponse = JSON.parse(authString);
    
    if (authResponse.user?.blockedbypay) {
      return <Navigate to="/pagos" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error parsing authResponse:", error);
    localStorage.removeItem("authResponse");
    return <Navigate to="/" replace />;
  }
};

function App() {
  // Conectar socket SOLO si hay usuario autenticado
  useEffect(() => {
    const auth = localStorage.getItem('authResponse');
    if (!auth) {
      console.log('👤 No hay usuario autenticado, omitiendo conexión socket');
      return;
    }

    console.log('🚀 Conectando socket desde App...');
    
    let mounted = true;
    
    const initSocket = async () => {
      try {
        const socket = await connectSocket();
        if (mounted && socket) {
          console.log('✅ Socket listo en App');
        }
      } catch (error) {
        console.error('❌ Error conectando socket en App:', error);
      }
    };

    initSocket();

    // Cleanup
    return () => {
      mounted = false;
      console.log('🧹 App cleanup - Socket se mantiene conectado');
      // NO desconectar aquí, se mantiene la conexión
    };
  }, []); // Solo una vez al montar

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
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;