import { useState, useCallback } from 'react';
import { showAlert } from "@/lib/utils/showAlert";
import { registerUserEndpoint } from "@/lib/api/users";
import { ProfileEndpoint } from "@/lib/api/profile";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  nickname: string;
  rol: '' | 'ADMIN' | 'BASIC';
  password: string;
  password2: string;
}

interface CrearusuarioLogicProps {
  onUserCreated?: () => void; // Callback para refrescar lista
}

export const useCrearusuarioLogic = ({ onUserCreated }: CrearusuarioLogicProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    nickname: '',
    rol: '',
    password: '',
    password2: '',
  });

  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      ciudad: '',
      nickname: '',
      rol: '',
      password: '',
      password2: '',
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.telefono || !formData.email || 
        !formData.password || !formData.ciudad || !formData.nickname || 
        !formData.rol || !formData.password2) {
      showAlert('Error', 'Por favor llena todos los campos', 'warning');
      return;
    }

    if (formData.password !== formData.password2) {
      showAlert('Error', 'Las contraseñas no coinciden', 'warning');
      return;
    }

    setLoading(true);

    try {
      // 1. Crear usuario
      const userResponse = await registerUserEndpoint({
        firstName: formData.nombre,
        lastName: formData.telefono,
        email: formData.email,
        password: formData.password,
        role: formData.rol,
        blocked: false,
        authStrategy: "BASIC",
      });

      if (userResponse.message && userResponse.message.includes("duplicate key value violates unique constraint")) {
        showAlert('Error', 'Este usuario ya está registrado', 'error');
        return;
      }

      // 2. Crear perfil
      await ProfileEndpoint({
        userId: userResponse.id,
        nickname: formData.nickname,
        City: formData.ciudad,
      });

      // 3. Mostrar éxito
      showAlert(
        'Operación Exitosa',
        `Usuario "${formData.nombre}" creado con éxito`,
        'success'
      ).then(() => {
        resetForm();
        toggleModal();
        if (onUserCreated) {
          onUserCreated(); // Refrescar lista sin reload
        }
      });

    } catch (error: any) {
      if (error?.response?.data?.message?.includes("duplicate key value violates unique constraint")) {
        showAlert('Error', 'Este usuario ya está registrado', 'error');
      } else {
        showAlert('Error', 'Estamos teniendo fallas técnicas', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, onUserCreated, resetForm, toggleModal]);

  return {
    isModalOpen,
    loading,
    formData,
    toggleModal,
    handleChange,
    handleSubmit
  };
};