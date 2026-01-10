import { loginEndpoint } from '@/lib/api/auth';
import { showAlert } from '@/lib/utils/showAlert';
import { validateLogin } from '@/lib/Validators/Login';

export interface LoginFormData {
  email: string;
  password: string;
}


export const handleLogin = async (formData: LoginFormData) => {
 
  if (!validateLogin(formData.email, formData.password)) {
    return null;
  }

  try {

    const response = await loginEndpoint({
      username: formData.email,
      password: formData.password,
    });

    
    if (!response || !response.accesToken) {
      showAlert('Error', 'No se recibió token de autenticación', 'error');
      return null;
    }

    return response;
  } catch (error: any) {

    if (error?.response?.data?.message === 'Acceso denegado: Usuario bloqueado.') {
      showAlert(
        'Usuario Bloqueado',
        'Por favor verifica tus pagos o ponte en contacto con el administrador',
        'warning'
      );
      return null;
    }

    if (error?.response?.data?.message === 'Datos errados') {
      showAlert('Error', 'Credenciales incorrectas', 'error');
      return null;
    }

    // Generic error
    showAlert('Error', 'Estamos teniendo fallas tecnicas', 'error');
    return null;
  }
};