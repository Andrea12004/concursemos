import { updateUserBlockStatusEndpoint } from '@/lib/api/users';
import { showAlert } from '@/lib/utils/showAlert';
import type { User } from '@/lib/types/user';

export interface BlockUserParams {
  user: User;
  token: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onTokenExpired?: () => void;
}

export class UserService {
  
  /**
   * Bloquea o desbloquea un usuario
   */
  static async blockUser({
    user,
    token,
    onSuccess,
    onError,
    onTokenExpired
  }: BlockUserParams): Promise<boolean> {
    try {
      const newBlockStatus = !user.blocked;
      
      // Llamada a la API
      await updateUserBlockStatusEndpoint(user.id, newBlockStatus, token);
      
      // Mostrar mensaje de éxito
      await showAlert(
        'Operación Exitosa',
        `Se ha ${newBlockStatus ? 'bloqueado' : 'desbloqueado'} el usuario exitosamente`,
        'success'
      );
      
      // Ejecutar callback de éxito
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
      
    } catch (error: any) {
      console.error('Error al bloquear usuario:', error);
      
      // Manejo específico de errores
      if (error?.response?.status === 401 || error?.response?.data?.message?.includes('Token')) {
        await showAlert(
          'Sesión Expirada',
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          'error'
        );
        
        if (onTokenExpired) {
          onTokenExpired();
        }
        
        return false;
      }
      
      // Error genérico
      await showAlert(
        'Error',
        error?.response?.data?.message || 'Estamos teniendo fallas técnicas. Por favor, intenta nuevamente.',
        'error'
      );
      
      // Ejecutar callback de error
      if (onError) {
        onError(error);
      }
      
      return false;
    }
  }

  /**
   * Obtiene el color del icono según el estado de bloqueo
   */
  static getBlockIconColor(blocked: boolean): string {
    return blocked ? '#70ceab' : '#d33';
  }

  /**
   * Obtiene el texto de la acción según el estado
   */
  static getBlockActionText(blocked: boolean): { 
    action: string; 
    confirm: string; 
    past: string;
  } {
    return {
      action: blocked ? 'desbloquear' : 'bloquear',
      confirm: blocked ? 'Desbloquear' : 'Bloquear',
      past: blocked ? 'desbloqueado' : 'bloqueado'
    };
  }
}