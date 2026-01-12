import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import SendReset from "@/pages/sendreset";
import Registro from "@/pages/Register";
import Reset from "@/pages/reset";
import Dashboard from "@/pages/dashboard";
import Partida from '@/pages/Departure';

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

    return <>{children}</>;
  } catch (error) {
    console.error("Error parsing authResponse:", error);
    localStorage.removeItem("authResponse");
    return <Navigate to="/" replace />;
  }
};

function App() {
  
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
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;