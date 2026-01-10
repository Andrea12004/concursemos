import { showAlert } from '@/lib/utils/showAlert';

export interface PasswordConditions {
  lengthValid: boolean;
  numberValid: boolean;
  specialValid: boolean;
}

export interface RegisterFormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  nickname: string;
  password: string;
}

export const validateRegisterForm = (
  formData: RegisterFormData,
  conditions: PasswordConditions,
  checkTerms: boolean
): boolean => {

  const missingFields: string[] = [];
  
  if (!formData.nombre.trim()) missingFields.push('nombre completo');
  if (!formData.telefono.trim()) missingFields.push('teléfono');
  if (!formData.email.trim()) missingFields.push('correo electrónico');
  if (!formData.password.trim()) missingFields.push('contraseña');
  if (!formData.ciudad.trim()) missingFields.push('ciudad');
  if (!formData.nickname.trim()) missingFields.push('usuario');

  if (missingFields.length > 0) {
    const nombres = missingFields.join(', ');
    showAlert('Campos incompletos', `Falta completar los siguientes campos: ${nombres}`, 'warning');
    return false;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showAlert('Error', 'Ingresa un correo electrónico válido', 'warning');
    return false;
  }

    
  const phoneRegex = /^\d+$/; 
  if (!phoneRegex.test(formData.telefono)) {
    showAlert('Error', 'El teléfono solo puede contener números', 'warning');
    return false;
  } 

  // Validar términos y condiciones
  if (!checkTerms) {
    showAlert('Error', 'Debes aceptar los términos y condiciones', 'warning');
    return false;
  }

  // Validar contraseña segura
  if (!conditions.lengthValid || !conditions.numberValid || !conditions.specialValid) {
    showAlert('Contraseña insegura', 'La contraseña debe cumplir con todos los requisitos de seguridad', 'warning');
    return false;
  }

  return true;
};

export const validatePassword = (password: string): PasswordConditions => {
  return {
    lengthValid: password.length >= 8,
    numberValid: /\d/.test(password),
    specialValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};