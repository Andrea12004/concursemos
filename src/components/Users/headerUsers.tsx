import React, { useState, useEffect} from 'react';
import type {FC} from 'react';
import Crearusuario from '@/components/modals/createUser';
import { Link, useNavigate } from 'react-router-dom';
import CrearPregunta from '@/components/modals/createQuestion';
import { Button, Popover } from 'antd';
import Swal from 'sweetalert2';
import './css/user_header.css';
import { Input } from '@/components/UI/Inputs/input';
import ImageButton from '@/components/UI/Button/ImageButton';
// Definición de tipos
interface AuthResponse {
  accesToken: string;
  user: {
    profile: any;
    role: string;
    [key: string]: any;
  };
}

interface Notification {
  id: number;
  message: string;
  text: string;
  author?: string;
  type: 'question' | 'reminder' | 'system';
  timestamp: string;
}

interface HeaderUsersProps {
  setSearchQuery: (query: string) => void;
}

interface UserData {
  role: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export const HeaderUsers: FC<HeaderUsersProps> = ({ setSearchQuery }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [token, setToken] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<UserData | null>(null);
  
  const navigate = useNavigate();

  const hide = (): void => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const goPerfil = (): void => {
    navigate('/perfil');
  };

  // Cargar los datos del localStorage (simulación)
  useEffect(() => {
    // Simular datos de usuario para la maqueta
    const mockAuthResponse: AuthResponse = {
      accesToken: "mock-token-12345",
      user: {
        profile: { nickname: "AdminUser", city: "Bogotá" },
        role: "ADMIN",
        name: "Administrador",
        email: "admin@ejemplo.com"
      }
    };

    // Para desarrollo, cargamos datos de ejemplo
    const savedAuthResponse = localStorage.getItem('authResponse');
    if (savedAuthResponse) {
      try {
        const authResponse: AuthResponse = JSON.parse(savedAuthResponse);
        setToken(authResponse.accesToken);
        setProfile(authResponse.user.profile);
        setUser(authResponse.user);
      } catch (error) {
        console.error('Error parsing authResponse from localStorage:', error);
        // Usar datos de ejemplo
        setToken(mockAuthResponse.accesToken);
        setProfile(mockAuthResponse.user.profile);
        setUser(mockAuthResponse.user);
      }
    } else {
      // Si no hay datos guardados, usar los de ejemplo
      setToken(mockAuthResponse.accesToken);
      setProfile(mockAuthResponse.user.profile);
      setUser(mockAuthResponse.user);
      // Guardarlos para futuras sesiones
      localStorage.setItem('authResponse', JSON.stringify(mockAuthResponse));
    }

    // Cargar notificaciones del localStorage
    const savedNotificationsStr = localStorage.getItem('notifications');
    if (savedNotificationsStr) {
      try {
        const savedNotifications: Notification[] = JSON.parse(savedNotificationsStr);
        setNotifications(savedNotifications);
      } catch (error) {
        console.error('Error parsing notifications from localStorage:', error);
      }
    }
  }, []);

  // Simular nueva notificación (para probar funcionalidad sin backend)
  const simulateQuestionNotification = (): void => {
    const authors = ["Usuario123", "Player456", "Admin789", "TestUser999"];
    const questions = [
      "¿Cuál es la capital de Francia?",
      "¿Qué año llegó Colón a América?",
      "¿Quién pintó la Mona Lisa?",
      "¿Cuál es el planeta más grande del sistema solar?",
      "¿En qué año terminó la Segunda Guerra Mundial?"
    ];
    
    const newNotification: Notification = {
      id: Date.now(),
      message: "Pregunta reportada",
      text: questions[Math.floor(Math.random() * questions.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      type: "question",
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Mostrar alerta
    Swal.fire({
      title: 'Nueva notificación',
      text: `Pregunta "${newNotification.text}" reportada por ${newNotification.author}`,
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    });
  };

  // Simular recordatorio
  const simulateReminderNotification = (): void => {
    const reminders = [
      "Revisa las preguntas pendientes de aprobación",
      "Tienes 5 usuarios nuevos por verificar",
      "Recordatorio: Revisar reportes de hoy",
      "Sistema: Actualización programada para mañana"
    ];
    
    const newNotification: Notification = {
      id: Date.now(),
      message: "Recordatorio",
      text: reminders[Math.floor(Math.random() * reminders.length)],
      type: "reminder",
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Limpiar notificaciones
  const clearNotifications = (): void => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todas las notificaciones',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('notifications');
        setNotifications([]);
        setOpen(false);
        
        Swal.fire({
          title: 'Notificaciones limpiadas',
          text: 'Todas las notificaciones han sido eliminadas',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Marcar notificación como leída
  const markAsRead = (id: number): void => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Para desarrollo: simular notificaciones automáticamente cada cierto tiempo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% de probabilidad cada 30 segundos
          simulateQuestionNotification();
        }
      }, 30000); // Cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [notifications]);

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