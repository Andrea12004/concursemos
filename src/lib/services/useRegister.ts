import { registerUserEndpoint } from '@/lib/api/users';
import { ProfileEndpoint } from '@/lib/api/profile';

export const authService = {
  async registerUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    blocked: boolean;
    authStrategy: string;
  }) {
    try {
      return await registerUserEndpoint(payload);
    } catch (error: any) {
      if (error.response?.data?.message?.includes('duplicate key value violates unique constraint')) {
        throw new Error('Este usuario ya está registrado');
      }
      throw new Error('Error del servidor');
    }
  },

  async Profile(payload: {
    userId: string;
    nickname: string;
    City: string;
  }) {
    try {
      return await ProfileEndpoint(payload);
    } catch (error: any) {
      throw new Error('Error al crear perfil');
    }
  }
};