import { showAlert } from '@/lib/utils/showAlert';

export const validateLogin = (email: string, password: string): boolean => {
  const missingFields: string[] = [];
  
  // Identificar campos faltantes
  if (!email.trim()) missingFields.push('email');
  if (!password.trim()) missingFields.push('password');

  // Si hay campos faltantes
  if (missingFields.length > 0) {
    const nombres = missingFields.map((f) => 
      f === 'email' ? 'correo electrónico' : 
      f === 'password' ? 'contraseña' : f
    ).join(', ');
    
    showAlert('Campos incompletos', `Falta completar los siguientes campos: ${nombres}`, 'warning');
    return false;
  }

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert('Error', 'Ingresa un correo electrónico válido', 'warning');
    return false;
  }

  return true; 
};