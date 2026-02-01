import { loginEndpoint } from '@/lib/api/auth';
import { showAlert } from '@/lib/utils/showAlert';
import { validateLogin } from '@/lib/Validators/Login';

export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Maneja el proceso de login
 * Guarda SOLO el token en localStorage
 * Los datos del usuario se guardarán en Redux después
 */
export const handleLogin = async (formData: LoginFormData) => {
  // Validar campos
  if (!validateLogin(formData.email, formData.password)) {
    return null;
  }

  try {
    const response = await loginEndpoint({
      username: formData.email,
      password: formData.password,
    });

    // Verificar que tengamos token
    if (!response || !response.accesToken) {
      showAlert('Error', 'No se recibió token de autenticación', 'error');
      return null;
    }

    //  SOLO guardar el token en localStorage
    localStorage.setItem('authToken', response.accesToken);
  

    return response;

  } catch (error: any) {
    // Usuario bloqueado
    if (error?.response?.data?.message === 'Acceso denegado: Usuario bloqueado.') {
      showAlert(
        'Usuario Bloqueado',
        'Por favor verifica tus pagos o ponte en contacto con el administrador',
        'warning'
      );
      return null;
    }

    // Credenciales incorrectas
    if (error?.response?.data?.message === 'Datos errados') {
      showAlert('Error', 'Credenciales incorrectas', 'error');
      return null;
    }

    // Error genérico
    showAlert('Error', 'Estamos teniendo fallas técnicas', 'error');
    return null;
  }
};