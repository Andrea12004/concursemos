import {showAlert} from '@/lib/utils/showAlert';

export interface ResetFormData {
  email: string;
}
export const validateResetForm = (formData: ResetFormData): boolean => {
  const missingFields: string[] = [];
  
  if (!formData.email.trim()) missingFields.push('correo electrónico');

  if (missingFields.length > 0) {
    const nombres = missingFields.join(', ');
    showAlert('Campos incompletos', `Falta completar el campo: ${nombres}`, 'warning');
    return false;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showAlert('Error', 'Ingresa un correo electrónico válido', 'warning');
    return false;
  }

  return true;
};