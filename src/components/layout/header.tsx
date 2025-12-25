import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Popover } from 'antd';
import type { HeaderProps, AuthResponse, Notification } from '@/lib/types/layout';
import './css/header.css'
import CrearPregunta from '../modals/crear-pregunta';

export const Header: React.FC<HeaderProps> = ({ setSearchQuery }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  // Simulación de datos del localStorage
  // const authResponse: AuthResponse = {
  //   accessToken: 'mock-token',
  //   user: {
  //     role: 'ADMIN',
  //     lastPaymentDate: null,
  //     profile: 'profile-image.png'
  //   }
  // };

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const goPerfil = () => {
    navigate('/perfil');
  };

  // Simulación de notificaciones para la maquetación
  const mockNotifications: Notification[] = [
    { text: '¿Cuál es la capital de Francia?' },
    { text: '¿Qué es React?' },
  ];

  // Inicializar notificaciones de ejemplo
  React.useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  return (
    <div className='header'>
      <div className='div-input-search-header'>
        <img src="/svg/header/searchinput.svg" alt="Search" />
        <input 
          type="text" 
          className='input-search-header' 
          placeholder='Buscar...' 
          onChange={handleSearchChange}
        />
      </div>

      <CrearPregunta />

      <Link to="/crear-partida" className='button-match'>
        <img src="/svg/header/agregarheadernegro.svg" alt="Crear partida" />
        <img src="/svg/header/agregarheaderblanco.svg" alt="Crear partida hover" className='create-hover' />
        Crear partida
      </Link>

      <div className='div-accesos-rapidos !gap-4'>
        <Popover
          content={
            <>
              <div className='div-notifications'>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index}>
                      <p>La pregunta {notification.text} ha sido reportada</p>
                    </div>
                  ))
                ) : (
                  <p>No hay notificaciones.</p>
                )}
              </div>
              <a onClick={hide}>Cerrar</a>
            </>
          }
          title="Notificaciones"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          placement="bottomLeft"
        >
          <button className='notificaciones'>
            <p className='notificaciones-flotantes'>{notifications.length}</p>
            <img src="/svg/header/notificacionesheader.svg" alt="Notificaciones" />
            <img src="/svg/header/notificacioneshover.svg" alt="Notificaciones hover" className='svg-accesos-rapidos' />
          </button>
        </Popover>

        <button onClick={goPerfil}>
          <img src="/svg/header/perfilheader.svg" alt="Perfil" />
          <img src="/svg/header/perfilhover.svg" alt="Perfil hover" className='svg-accesos-rapidos' />
        </button>
      </div>
    </div>
  );
};

export default Header;