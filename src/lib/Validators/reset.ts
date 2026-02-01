import {showAlert} from '@/lib/utils/showAlert';

export interface ResetPasswordFormData {
  newPassword: string;
}

//validar que Contraseña Nueva y Confirma tu contraseña sean iguales
export const validateReset = (
  formData: ResetPasswordFormData,
  confirmPassword: string
): boolean => {
  const missingFields: string[] = [];

  if (!formData.newPassword.trim()) missingFields.push('contraseña nueva');
  if (!confirmPassword.trim()) missingFields.push('confirmar contraseña');

  if (missingFields.length > 0) {
    const nombres = missingFields.join(', ');
    showAlert('Campos incompletos', `Falta completar el campo: ${nombres}`, 'warning');
    return false;
  }

  if (formData.newPassword !== confirmPassword) {
    showAlert('Error', 'Las contraseñas no coinciden', 'warning');
    return false;
  }

  return true;
};