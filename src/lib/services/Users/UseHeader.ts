import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthData } from '@/lib/hooks/useAuthData';
import socket from '@/settings/socket';
import { showAlert } from '@/lib/utils/showAlert';

/* Interfaces */
interface HeaderUsersLogicProps {
  setSearchQuery: (query: string) => void;
}

interface Notification {
  message: string;
  text: string;
  author?: string;
  timestamp: string;
}

interface SocketQuestionMessage {
  message: string;
  text: string;
  author: string;
}

interface SocketReminderMessage {
  message: string;
}

export const useHeaderUsersLogic = ({ setSearchQuery }: HeaderUsersLogicProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuthData(); //  Usar hook centralizado

  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const listenersRegistered = useRef(false);
  const debounceTimer = useRef<number | null>(null);

  // Verificar si es admin con useMemo
  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user?.role]);

  // Handlers optimizados
  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  const goPerfil = useCallback(() => {
    navigate('/perfil');
  }, [navigate]);

  // Función para agregar notificación
  const addNotification = useCallback((notification: Omit<Notification, 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => {
      // evitar duplicados inmediatos
      const exists = prev.some(n => n.text === newNotification.text && n.message === newNotification.message);
      const updated = exists ? prev : [...prev, newNotification];

      // Guardar en localStorage (máximo 50 notificaciones)
      const toSave = updated.slice(-50);
      localStorage.setItem('notifications', JSON.stringify(toSave));

      return updated;
    });
  }, []);

  // Cargar notificaciones del localStorage al montar
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications) as Notification[];
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setNotifications([]);
    }
  }, []);

  //  Unirse a la sala de admin cuando el usuario sea ADMIN
  useEffect(() => {
    if (isAdmin) {
      socket.emit('joinAdminRoom', {});
    }
  }, [isAdmin]);

  //  Escuchar eventos de socket para ADMIN
  useEffect(() => {
    if (!isAdmin) return;

    if (listenersRegistered.current) return;

    // Evento: Usuario unido a sala admin
    const handleJoinedAdminRoom = (message: any) => { };

    // Evento: Pregunta necesita aprobación
    const handleQuestionNeedsApproval = (message: SocketQuestionMessage) => {
      showAlert(
        message.message,
        `${message.text} del autor ${message.author}`,
        'warning'
      );

      // Agregar notificación
      addNotification({
        message: message.message,
        text: message.text,
        author: message.author
      });
    };

    // Registrar listeners
    socket.on('joinedAdminRoom', handleJoinedAdminRoom);
    socket.on('questionNeedsApproval', handleQuestionNeedsApproval);

    listenersRegistered.current = true;

    // Cleanup: remover listeners al desmontar
    return () => {
      socket.off('joinedAdminRoom', handleJoinedAdminRoom);
      socket.off('questionNeedsApproval', handleQuestionNeedsApproval);
      listenersRegistered.current = false;
    };
  }, [isAdmin, addNotification]);

  // Escuchar recordatorios (para todos los usuarios)
  useEffect(() => {
    const handleReminder = (message: SocketReminderMessage) => {
      showAlert('Recordatorio', message.message, 'warning');

      // Agregar notificación
      addNotification({ message: 'Recordatorio', text: message.message });
    };

    socket.on('reminder', handleReminder);

    // Cleanup
    return () => {
      socket.off('reminder', handleReminder);
    };
  }, [addNotification]);

  // Debounced search change to reduce updates
  const handleSearchChangeDebounced = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value || '';
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    // @ts-ignore
    debounceTimer.current = window.setTimeout(() => {
      setSearchQuery(value);
      debounceTimer.current = null;
    }, 200);
  }, [setSearchQuery]);

  const clearNotifications = useCallback(() => {
    localStorage.removeItem('notifications');
    setNotifications([]);
  }, []);

  return {
    open,
    notifications,
    user,
    profile,
    isAdmin,
    handleOpenChange,
    hide,
    handleSearchChange: handleSearchChangeDebounced,
    goPerfil,
    clearNotifications
  };
};