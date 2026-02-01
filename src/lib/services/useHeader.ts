import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "@/lib/store/hooks";
import socket from '@/settings/socket';
import { showAlert } from '@/lib/utils/showAlert';

interface HeaderLogicProps {
  setSearchQuery: (query: string) => void;
}

interface Notification {
  text?: string;
  message?: string;
  timestamp?: string;
}

export const useHeaderLogic = ({ setSearchQuery }: HeaderLogicProps) => {
  const navigate = useNavigate();
  const { user: reduxUser } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const listenersRegistered = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null); 


  const authFromStorage = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('authResponse') || 'null');
    } catch (err) {
      return null;
    }
  }, []);

  const user = reduxUser || authFromStorage?.user || null;
  const token = authFromStorage?.accesToken || '';
  const profile = user?.profile || authFromStorage?.user?.profile || null;

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user?.role]);

  // Cargar notificaciones del localStorage al montar
  useEffect(() => {
    const savedNotifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    ) as Notification[];
    setNotifications(savedNotifications);
  }, []);

  // Unirse a sala de admin cuando el usuario sea ADMIN
  useEffect(() => {
    if (isAdmin) {
      socket.emit('joinAdminRoom', {});
    }
  }, [isAdmin]);

  useEffect(() => {
    if (listenersRegistered.current) return;

    // Handlers definidos por referencia para off() correcto
    const handleJoinedAdminRoom = () => { };
    const handleSocketError = () => { };

    const handleQuestionNeedsApproval = (message: Notification) => {
      showAlert(
        'Pregunta reportada',
        `La pregunta ${message.text} ha sido reportada`,
        'warning'
      );

      const saved = (JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[]);
      saved.push(message);
      localStorage.setItem('notifications', JSON.stringify(saved));
      setNotifications(saved);
    };

    const handleReminder = (message: Notification) => {
      showAlert('Recordatorio', message.message || '', 'warning');
      const saved = (JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[]);
      saved.push(message);
      localStorage.setItem('notifications', JSON.stringify(saved));
      setNotifications(saved);
    };

    if (isAdmin) {
      socket.on('joinedAdminRoom', handleJoinedAdminRoom);
      socket.on('error', handleSocketError);
      socket.on('questionNeedsApproval', handleQuestionNeedsApproval);
    }

    socket.on('reminder', handleReminder);

    listenersRegistered.current = true;

    return () => {
      if (isAdmin) {
        socket.off('joinedAdminRoom', handleJoinedAdminRoom);
        socket.off('error', handleSocketError);
        socket.off('questionNeedsApproval', handleQuestionNeedsApproval);
      }
      socket.off('reminder', handleReminder);
      listenersRegistered.current = false;
    };
  }, [isAdmin]);

  // Handlers
  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);


  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Limpiar timeout anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
   
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
    }, 150);
  }, [setSearchQuery]);

  const goPerfil = useCallback(() => navigate('/perfil'), [navigate]);

  const clearNotifications = useCallback(() => {
    localStorage.removeItem('notifications');
    setNotifications([]);
  }, []);

  return {
    open,
    notifications,
    user,
    profile,
    token,
    isAdmin,
    setOpen,
    handleOpenChange,
    hide,
    handleSearchChange,
    goPerfil,
    clearNotifications,
    navigate,
  };
};