import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/lib/store/hooks';
import { useLogout } from '@/lib/hooks/useLogout';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { showConfirm } from '@/lib/utils/showAlert';
import {
  getSubscriptionsEndpoint,
  cancelSubscriptionEndpoint
} from '@/lib/api/pay';

interface FormData {
  nickname: string;
  telefono: string;
  email: string;
  city: string;
  cc: string;
  genero: string;
  photo: string;
}

export const useTusDatosLogic = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  // Obtener datos de Redux
  const { user, profile } = useAppSelector((state) => state.auth);

  // Token con useMemo
  const token = useMemo(() => {
    return localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      '';
  }, []);

  // Datos calculados DIRECTAMENTE de Redux (sin state duplicado)
  const formData = useMemo<FormData>(() => {
    if (!user || !profile) {
      return {
        nickname: '',
        telefono: '',
        email: '',
        city: '',
        cc: '',
        genero: '',
        photo: '',
      };
    }

    return {
      nickname: profile.nickname || '',
      telefono: user.lastName || '',
      email: user.email || '',
      city: profile.City || '',
      cc: String(profile.CC || ''),
      genero: profile.Gender || '',
      photo: profile.photoUrl || '',
    };
  }, [user, profile]);

  const photo = useMemo(() => profile?.photoUrl || '', [profile?.photoUrl]);


  const lastPaymentDate = useMemo(() => user?.lastPaymentDate || '', [user?.lastPaymentDate]);

  const nextPaymentDate = useMemo(() => {
    if (!user?.lastPaymentDate) return '';

    const paymentDate = new Date(user.lastPaymentDate);
    paymentDate.setDate(paymentDate.getDate() + 30);
    return paymentDate.toISOString().split('T')[0];
  }, [user?.lastPaymentDate]);

  const [suscriptionId, setSuscriptionId] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar autenticación primero
  useEffect(() => {
    if (!user || !profile) {
      navigate('/', { replace: true });
    }
  }, [user, profile, navigate]);

  //  Obtener información de suscripción
  const getPagos = useCallback(async () => {
    if (!token || !user?.id) return;

    setLoading(true);
    try {
      const data = await getSubscriptionsEndpoint(user.id, token);

      if (data.subscriptions && data.subscriptions.length > 0) {
        setSuscriptionId(data.subscriptions[0].subscriptionId);
      }
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id, logout]);

  useEffect(() => {
    getPagos();
  }, [getPagos]);

  // Cancelar suscripción
  const cancelSuscription = useCallback(async () => {
    if (!suscriptionId) {
      console.warn('No hay ID de suscripción para cancelar');
      return;
    }

    setLoading(true);
    try {
      await cancelSubscriptionEndpoint(suscriptionId, token);


      logout();
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [suscriptionId, token, logout]);

  // Confirmar y cancelar suscripción
  const confirmCancel = useCallback(() => {
    showConfirm(
      '¿Estás Seguro?',
      'Esta acción cancelará tu suscripción inmediatamente',
      'Cancelar suscripción',
      cancelSuscription
    );
  }, [cancelSuscription]);

  // Handler vacío para mantener compatibilidad con el componente
  const handleChange = useCallback(() => { }, []);

  return {
    formData,
    photo,
    lastPaymentDate,
    nextPaymentDate,
    loading,
    user,
    profile,
    confirmCancel,
    handleChange
  };
};