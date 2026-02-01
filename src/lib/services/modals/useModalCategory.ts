import { useState, useMemo, useCallback } from 'react';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';
import { createQuestionCategoryEndpoint } from '@/lib/api/Questions';

interface FormData {
  nombre: string;
  imagen: File | string;
}

interface CrearCategoriaLogicProps {
  onReload?: () => void; 
}

export const useCrearCategoriaLogic = ({ onReload }: CrearCategoriaLogicProps) => {
  const { logout } = useLogout();
  

  const token = useMemo(() => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('cnrsms_token') || 
           '';
  }, []);

  const [showState, setShowState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameFile, setNameFile] = useState('');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    imagen: '',
  });

  // Función para manejar el cambio en los campos
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value, type } = e.target;

    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png'];

      if (!validTypes.includes(file.type)) {
        showAlert('Advertencia', 'Formato de archivo no válido', 'warning');
        e.target.value = '';
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
      setNameFile(value);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  }, []);

  // Cerrar modal y resetear formulario
  const closeModal = useCallback(() => {
    setShowState(false);
    setFormData({ nombre: '', imagen: '' });
    setNameFile('');
  }, []);

  // Abrir modal
  const openModal = useCallback(() => {
    setShowState(true);
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.imagen) {
      showAlert('Error', 'Por favor completa todos los campos y adjunta una imagen', 'warning');
      return;
    }

    if (!token) {
      showAlert('Error', 'Token no válido. Vuelve a iniciar sesión', 'error');
      logout();
      return;
    }

    setLoading(true);

    const categoryData = new FormData();
    categoryData.append('category', formData.nombre);
    categoryData.append('file', formData.imagen as File);

    try {
      const response = await createQuestionCategoryEndpoint(categoryData, token);

      if (response.message && response.message.includes('duplicate key value violates unique constraint')) {
        showAlert('Error', 'Esta categoría ya está registrada', 'error');
        return;
      }

      showAlert(
        'Operación Exitosa',
        `Categoría "${formData.nombre}" creada con éxito`,
        'success'
      ).then(() => {
        closeModal();
        if (onReload) {
          onReload();
        }
      });
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [formData, token, onReload, closeModal, logout]);

  return {
    show: showState,
    loading,
    nameFile,
    formData,
    token,
    closeModal,
    openModal,
    handleChange,
    handleSubmit
  };
};