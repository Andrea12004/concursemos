import React, { useState, useEffect} from 'react';
import Crearusuario from '@/components/modals/createUser';
import { Link, useNavigate } from 'react-router-dom';
import CrearPregunta from '@/components/modals/createQuestion';
import { Button, Popover } from 'antd';
import './css/user_header.css';
import { Input } from '@/components/UI/Inputs/input';
import socket from '@/settings/socket';
import { showAlert } from '@/lib/utils/showAlert';
/* Interfaces */
interface HeaderUsersProps {
  setSearchQuery: (query: string) => void;
}

interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'BASIC';
  profile?: any;
}

interface AuthResponse {
  accesToken: string;
  user: User;
}

interface Notification {
  message: string;
  text: string;
  author?: string;
  timestamp?: string;
}

interface SocketQuestionMessage {
  message: string;
  text: string;
  author: string;
}

interface SocketReminderMessage {
  message: string;
}

const HeaderUsers: React.FC<HeaderUsersProps> = ({ setSearchQuery }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [token, setToken] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const navigate = useNavigate();

  // Handlers
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

  // Cargar los datos del localStorage
  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem('authResponse');
      if (authResponseStr) {
        const authResponse: AuthResponse = JSON.parse(authResponseStr);
        setToken(authResponse.accesToken);
        setProfile(authResponse.user.profile);
        setUser(authResponse.user);
      }
    } catch (error) {
      console.error('Error al cargar datos de autenticación:', error);
    }
  }, []);

  // Unirse a la sala de admin cuando el usuario sea ADMIN
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      console.log('👤 Usuario ADMIN detectado, uniéndose a sala admin...');
      socket.emit('joinAdminRoom', {});
    }
  }, [user]);

  // Escuchar eventos de socket para ADMIN
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    // Evento: Usuario unido a sala admin
    const handleJoinedAdminRoom = (message: any) => {
      console.log('✅ Unido a sala admin:', message);
    };

    // Evento: Pregunta necesita aprobación
    const handleQuestionNeedsApproval = (message: SocketQuestionMessage) => {
      console.log('⚠️ Pregunta necesita aprobación:', message);
      
      showAlert(
        message.message,
        `${message.text} del autor ${message.author}`,
        'warning'
      );

      // Guardar notificación en localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      notifications.push({
        message: message.message,
        text: message.text,
        author: message.author,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Actualizar estado
      setNotifications(notifications);
    };

    // Registrar listeners
    socket.on('joinedAdminRoom', handleJoinedAdminRoom);
    socket.on('questionNeedsApproval', handleQuestionNeedsApproval);

    // Cleanup: remover listeners al desmontar
    return () => {
      socket.off('joinedAdminRoom', handleJoinedAdminRoom);
      socket.off('questionNeedsApproval', handleQuestionNeedsApproval);
    };
  }, [user]);

  // Escuchar recordatorios (para todos los usuarios)
  useEffect(() => {
    const handleReminder = (message: SocketReminderMessage) => {
      console.log('🔔 Recordatorio recibido:', message);
      
      showAlert(
        'Recordatorio',
        message.message,
        'warning'
      );

      // Guardar notificación en localStorage
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      notifications.push({
        message: 'Recordatorio',
        text: message.message,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Actualizar estado
      setNotifications(notifications);
    };

    socket.on('reminder', handleReminder);

    // Cleanup
    return () => {
      socket.off('reminder', handleReminder);
    };
  }, []);

  // Cargar las notificaciones del localStorage al montar
  useEffect(() => {
    try {
      const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      setNotifications(savedNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setNotifications([]);
    }
  }, []);

  // Limpiar notificaciones (función helper - opcional)
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
    hide();
  };


  return (
     <div className='header'>
      <div className='div-input-search-header'>
        <img src="/svg/header/searchinput.svg" alt="Search" />
        <Input
          name="search"
          type="text"
          className='input-search-header'
          placeholder='Buscar...'
          onChange={handleSearchChange}
        />
      </div>

      <Crearusuario />

      <CrearPregunta />
      
      <Link to="/crear-partida" className='button-match'>
        <img src="/svg/header/agregarheadernegro.svg" alt="Create match" />
        <img src="/svg/header/agregarheaderblanco.svg" alt="Create match hover" className='create-hover' />
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
                <button className='notificaciones icon-md'>
                  <p className='notificaciones-flotantes'>{notifications.length}</p>
                  <img src="/svg/header/notificacionesheader.svg" alt="Notificaciones" />
                  <img src="/svg/header/notificacioneshover.svg" alt="Notificaciones hover" className='svg-accesos-rapidos' />
                </button>
              </Popover>
      
              <button onClick={goPerfil} className='icon-md'>
                <img src="/svg/header/perfilheader.svg" alt="Perfil" />
                <img src="/svg/header/perfilhover.svg" alt="Perfil hover" className='svg-accesos-rapidos' />
              </button>
            </div>
    </div>
  );
};

export default HeaderUsers;