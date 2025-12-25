import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import type { AuthResponse } from '@/lib/types/layout';
import './css/sidebar.css'
import { useAuth } from '@/lib/auth';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => (typeof window !== 'undefined') ? window.innerWidth >= 768 : true);

  const auth = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    // usar provider para logout
    try { auth.logout(); } catch (e) {}
    console.log('Logout realizado');
    navigate("/");
  };

  const goPagos = () => {
    navigate("/pagos");
  };

  return (
    <div className={`${isSidebarOpen ? 'sidebar' : 'sidebar-hidden'}`}>
      {/* Movil */}
      <button className='activador-sidebar-movil' onClick={toggleSidebar}>
        <img src={`${isSidebarOpen ? '/svg/sidebar/collapse.svg' : '/svg/sidebar/menu.svg'}`} alt="Toggle sidebar" />
      </button>

      {/* HEADER */}
      <Link to="/dashboard" className='header-side'>
        <img src="/images/Logos/Logo-login.png" alt="Logo" className='img-header-side'/>
      </Link>

      {/* CONTENT */}
      <div className='content-side'>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : undefined}>
          <img src="/svg/sidebar/dashboard.svg" alt="Dashboard" />
          <img src="/svg/sidebar/dashboardhover.svg" alt="Dashboard hover" className='hover-side'/>
          Dashboard
        </NavLink>
        <NavLink to="/salas" className={({isActive}) => isActive ? 'active' : undefined}>
          <img src="/svg/sidebar/partidas.svg" alt="Partidas" />
          <img src="/svg/sidebar/partidashover.svg" alt="Partidas hover" className='hover-side'/>
          Partidas
        </NavLink>
        <NavLink to="/banco" className={({isActive}) => isActive ? 'active' : undefined}>
          <img src="/svg/sidebar/banco.svg" alt="Banco" />
          <img src="/svg/sidebar/bancohover.svg" alt="Banco hover" className='hover-side'/>
          Preguntas Y Categorias
        </NavLink>
        <NavLink to="/pagos" className={({isActive}) => isActive ? 'active' : undefined}>
          <img src="/svg/sidebar/pagos.svg" alt="Pagos" />
          <img src="/svg/sidebar/pagoshover.svg" alt="Pagos hover" className='hover-side'/>
          Pagos
        </NavLink>
        <NavLink to="/perfil" className={({isActive}) => isActive ? 'active' : undefined}>
          <img src="/svg/sidebar/perfil.svg" alt="Perfil" />
          <img src="/svg/sidebar/perfilhover.svg" alt="Perfil hover" className='hover-side'/>
          Perfil y ajustes
        </NavLink>
        <NavLink to="/usuarios" className={({isActive}) => isActive ? 'active' : undefined}>
          <img src="/svg/sidebar/usuarios.svg" alt="Usuarios" />
          <img src="/svg/sidebar/usuarioshover.svg" alt="Usuarios hover" className='hover-side'/>
          {auth.state?.role === 'ADMIN' ? 'Usuarios' : 'Ranking'}
        </NavLink>
      </div>

      {/* UNLOCK: mostrar sugerencia de pago solo si NO es admin */}
      {auth.state?.role !== 'ADMIN' && (
        <div className='unlock-div-side'>
          <img src="/svg/sidebar/unlock.svg" alt="Unlock" />
          <p>Desbloquear todos los beneficios</p>
          <button onClick={goPagos}>Desbloquear</button>
        </div>
      )}

      {/* LOGOUT */}
      <div className='logout-side'>
        <button onClick={logout}>
          <img src="/svg/sidebar/logout.svg" alt="Logout" />
          <img src="/svg/sidebar/logouthover.svg" alt="Logout hover" className='logout-hover'/>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;