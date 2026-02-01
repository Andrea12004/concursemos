import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppSelector } from "@/lib/store/hooks";
import { useLogout } from "@/lib/hooks/useLogout";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { showAlert } from "@/lib/utils/showAlert";
import { createQuestionEndpoint, getAllQuestionCategoriesEndpoint } from "@/lib/api/Questions";
import { validateQuestionForm } from "@/lib/Validators/Question";

interface FormData {
  Pregunta: string;
  Categoria: string;
  Respuesta1: string;
  Respuesta2: string;
  Respuesta3: string;
  Respuesta4: string;
  CorrectAnswer: string;
}

interface Category {
  id: string | number;
  category: string;
}

interface UseCrearpreguntaLogicProps {
  onReload?: () => void;
}

export const useCrearpreguntaLogic = ({ onReload }: UseCrearpreguntaLogicProps = {}) => {
  const { logout } = useLogout();
  const { user, profile } = useAppSelector((state) => state.auth);

  const token = useMemo(() => {
    return localStorage.getItem('authToken') || '';
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const hasInitialized = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    Pregunta: '',
    Categoria: '',
    Respuesta1: '',
    Respuesta2: '',
    Respuesta3: '',
    Respuesta4: '',
    CorrectAnswer: '',
  });

  const getCategories = useCallback(async () => {
    if (!token) return;

    try {
      const response = await getAllQuestionCategoriesEndpoint(token);
      setCategories(response);
    } catch (error) {
      handleAxiosError(error, logout);
    }
  }, [token, logout]);

  useEffect(() => {
    if (!token) return;
    if (hasInitialized.current && refreshTrigger === 0) return;

    hasInitialized.current = true;
    getCategories();
  }, [refreshTrigger]);

  const toggleModal = useCallback((open: boolean) => {
    setIsModalOpen(open);
    const modalElement = document.getElementById('pregunta');
    if (modalElement) {
      if (open) {
        modalElement.classList.remove('hidden');
      } else {
        modalElement.classList.add('hidden');
      }
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const refreshCategories = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todo el formulario en una sola función
    if (!validateQuestionForm(formData, profile?.id)) {
      return;
    }

    setLoading(true);

    try {
      const response = await createQuestionEndpoint(
        profile!.id,
        {
          text: formData.Pregunta,
          IsAproved: user?.role === 'ADMIN',
          isReported: false,
          answers: [
            { text: formData.Respuesta1, isCorrect: formData.CorrectAnswer === 'Respuesta1' },
            { text: formData.Respuesta2, isCorrect: formData.CorrectAnswer === 'Respuesta2' },
            { text: formData.Respuesta3, isCorrect: formData.CorrectAnswer === 'Respuesta3' },
            { text: formData.Respuesta4, isCorrect: formData.CorrectAnswer === 'Respuesta4' }
          ],
          categoryId: formData.Categoria
        },
        token
      );

      if (response.message && response.message.includes("duplicate key value violates unique constraint")) {
        showAlert('Error', 'Esta pregunta ya está registrada', 'error');
        return;
      }

      await showAlert(
        'Operación Exitosa',
        `Pregunta creada con éxito`,
        'success'
      );

      toggleModal(false);
      setFormData({
        Pregunta: '',
        Categoria: '',
        Respuesta1: '',
        Respuesta2: '',
        Respuesta3: '',
        Respuesta4: '',
        CorrectAnswer: '',
      });

      // Disparar recarga de preguntas
      if (onReload) {
        onReload();
      }
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [formData, profile?.id, user?.role, token, toggleModal, logout, onReload]);

  return {
    categories,
    loading,
    isModalOpen,
    formData,
    toggleModal,
    handleChange,
    handleSubmit,
    refreshCategories
  };
};