import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResetPasswordEndpoint } from '@/lib/api/auth';
import { validateReset } from '@/lib/Validators/reset';
import { showAlert } from '@/lib/utils/showAlert';
import axios from 'axios';

interface PasswordConditions {
  lengthValid: boolean;
  numberValid: boolean;
  specialValid: boolean;
  coincide: boolean;
}

export const useResetPasswordService = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState<PasswordConditions>({
    lengthValid: false,
    numberValid: false,
    specialValid: false,
    coincide: false,
  });

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [location.search]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const newConditions = {
      lengthValid: newPassword.length >= 8,
      numberValid: /\d/.test(newPassword),
      specialValid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      coincide: newPassword === password2,
    };
    
    setConditions(newConditions);
  }, [password2]);

  const handlePasswordChange2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword2 = e.target.value;
    setPassword2(newPassword2);

    setConditions(prev => ({
      ...prev,
      coincide: password === newPassword2,
    }));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const formData = { newPassword: password };
    if (!validateReset(formData, password2)) {
      return;
    }

    // Validar condiciones de seguridad
    if (!conditions.lengthValid || !conditions.numberValid || !conditions.specialValid) {
      showAlert('Contraseña insegura', 'La contraseña debe cumplir con los requisitos', 'warning');
      return;
    }

    if (!token) {
      showAlert('Error', 'Token no encontrado', 'error');
      return;
    }

    setLoading(true);
    try {
   
      await ResetPasswordEndpoint({
        token,
        newPassword: password
      });

      showAlert(
        'Operación Exitosa', 
        'Contraseña restablecida exitosamente', 
        'success'
      ).then(() => {
        navigate('/');
      });
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showAlert(
          'Error', 
          error.response?.data?.message || 'Error al restablecer la contraseña', 
          'error'
        );
      } else {
        showAlert('Error', 'Estamos teniendo fallas técnicas', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados
    password,
    password2,
    token,
    loading,
    conditions,
    
    // Funciones
    handleSubmit,
    handlePasswordChange,
    handlePasswordChange2,
    setPassword,
    setPassword2,
  };
};