import { requestResetPasswordEndpoint } from '@/lib/api/auth';
import { showAlert } from '@/lib/utils/showAlert';
import { validateResetForm } from '@/lib/Validators/sendReset';

export interface ResetFormData {
  email: string;
}

export const handleResetPassword = async (
  formData: ResetFormData,
) => {

  if (!validateResetForm(formData)) {
    return false;
  }

  try {

    await requestResetPasswordEndpoint({
      email: formData.email,
    });

    // Show success message
    showAlert(
      'Operación Exitosa',
      `Se ha enviado un correo de restablecimiento a ${formData.email}`,
      'success'
    );

    return true;
  } catch (error: any) {
    if (error?.response?.data?.message === 'Datos errados') {
      showAlert('Error', 'Datos Errados', 'error');
      return false;
    }

    showAlert('Error', 'Estamos teniendo fallas técnicas', 'error');
    return false;
  }
};