import React, { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import "./css/sidebar.css";
import { useAppSelector } from "@/lib/store/hooks";
import { useLogout } from '@/lib/hooks/useLogout';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const { user } = useAppSelector((state) => state.auth);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  return (
    <div className={isSidebarOpen ? "sidebar" : "sidebar-hidden"}>
      {/* BOTÓN MÓVIL */}
      <button className="activador-sidebar-movil" onClick={() => setIsSidebarOpen((prev) => !prev)}>
        <img
          src={
            isSidebarOpen
              ? "/svg/sidebar/collapse.svg"
              : "/svg/sidebar/menu.svg"
          }
          alt="Toggle sidebar"
        />
      </button>

      {/* HEADER */}
      <Link to="/dashboard" className="header-side">
        <img
          src="/images/Logos/Logo-login.png"
          alt="Logo"
          className="img-header-side"
        />
      </Link>

      {/* LINKS */}
      <div className="content-side">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <img src="/svg/sidebar/dashboard.svg" alt="Dashboard" />
          <img src="/svg/sidebar/dashboardhover.svg" className="hover-side" />
          Dashboard
        </NavLink>

        <NavLink to="/salas" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <img src="/svg/sidebar/partidas.svg" alt="Partidas" />
          <img src="/svg/sidebar/partidashover.svg" className="hover-side" />
          Partidas
        </NavLink>

        <NavLink to="/banco" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <img src="/svg/sidebar/banco.svg" alt="Banco" />
          <img src="/svg/sidebar/bancohover.svg" className="hover-side" />
          Preguntas y Categorías
        </NavLink>

        <NavLink to="/pagos" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <img src="/svg/sidebar/pagos.svg" alt="Pagos" />
          <img src="/svg/sidebar/pagoshover.svg" className="hover-side" />
          Pagos
        </NavLink>

        <NavLink to="/perfil" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <img src="/svg/sidebar/perfil.svg" alt="Perfil" />
          <img src="/svg/sidebar/perfilhover.svg" className="hover-side" />
          Perfil y ajustes
        </NavLink>

        <NavLink to="/usuarios" className={({ isActive }) => (isActive ? "active" : undefined)}>
          <img src="/svg/sidebar/usuarios.svg" alt="Usuarios" />
          <img src="/svg/sidebar/usuarioshover.svg" className="hover-side" />
          {user?.role === "ADMIN" ? "Usuarios" : "Ranking"}
        </NavLink>
      </div>

      {/* BLOQUE DE PAGO (SOLO NO ADMIN) */}
      {user?.role !== "ADMIN" && (
        <div className="unlock-div-side">
          <img src="/svg/sidebar/unlock.svg" alt="Unlock" />
          <p>Desbloquear todos los beneficios</p>
          <button onClick={() => navigate("/pagos")}>Desbloquear</button>
        </div>
      )}

      {/* LOGOUT */}
      <div className="logout-side">
        <button onClick={logout}>
          <img src="/svg/sidebar/logout.svg" alt="Logout" />
          <img
            src="/svg/sidebar/logouthover.svg"
            alt="Logout hover"
            className="logout-hover"
          />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
