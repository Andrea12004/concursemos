// src/lib/hooks/useQuestionBank.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getAllQuestionsEndpoint } from '@/lib/api/Questions';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { useLogout } from '@/lib/hooks/useLogout';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Category {
  id: string | number;
  category: string;
}

interface Author {
  id: string | number;
}

interface Question {
  id: string | number;
  text: string;
  author: Author;
  answers: Answer[];
  IsAproved?: boolean;
  isReported?: boolean;
  category: Category;
}

interface UseQuestionBankProps {
  searchQuery: string;
}

/**
 * Hook: useQuestionBank
 * Maneja el banco de preguntas con la misma lógica del original
 */
export const useQuestionBank = ({ searchQuery }: UseQuestionBankProps) => {
  const { logout } = useLogout();
  
  // Estados
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<string | number>('');
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [update, setUpdate] = useState<boolean>(false);
  
  // Filtros (igual que el original)
  const [filterAprove, setFilterAprove] = useState<boolean | null>(true);
  const [filterReport, setFilterReport] = useState<boolean>(false);
  
  const hasLoadedQuestions = useRef(false);

  /**
   * 1️⃣ Cargar token y user
   */
  useEffect(() => {
    try {
      const authResponse = JSON.parse(localStorage.getItem('authResponse') || '{}');
      if (authResponse?.accesToken) {
        setToken(authResponse.accesToken);
        setUserID(authResponse.user?.profile?.id || '');
        setUser(authResponse.user || null);
      }
    } catch (error) {
      console.error('Error parsing auth response:', error);
    }
  }, []);

  /**
   * 2️⃣ Ordenar por defecto (primera carga) - IGUAL QUE EL ORIGINAL
   */
  const ordenarPorDefecto = (estado: string, response: Question[]) => {
    const preguntasOrdenadas = [...response].sort((a, b) => {
      if (estado === 'aprobado') {
        if (a.IsAproved && !b.IsAproved) return -1;
        if (!a.IsAproved && b.IsAproved) return 1;
      } else if (estado === 'reportado') {
        if (a.isReported && !b.isReported) return -1;
        if (!a.isReported && b.isReported) return 1;
      } else if (estado === 'rechazado') {
        if (!a.IsAproved && b.IsAproved) return -1;
        if (a.IsAproved && !b.IsAproved) return 1;
      }
      return 0;
    });
    
    // Actualizar filtros según estado (igual que el original)
    if (estado === 'aprobado') {
      setFilterAprove(true);
      setFilterReport(false);
    } else if (estado === 'reportado') {
      setFilterReport(true);
      setFilterAprove(null);
    } else if (estado === 'rechazado') {
      setFilterAprove(false);
      setFilterReport(false);
    }
    
    setQuestions(preguntasOrdenadas);
  };

  /**
   * 3️⃣ Obtener preguntas - LÓGICA EXACTA DEL ORIGINAL
   */
  const getQuestions = useCallback(async () => {
    if (!token || hasLoadedQuestions.current) return;
    
    setLoading(true);
    
    try {
      // ✅ Llamada a la API (reemplaza axios.get)
      const response = await getAllQuestionsEndpoint(token);
      
      // ✅ LÓGICA EXACTA DEL ORIGINAL:
      if (user?.role === 'ADMIN') {
        // ADMIN: Ordenar según filtro activo
        if (filterAprove === true) {
          ordenarPorDefecto('aprobado', response);
        } else if (filterAprove === false) {
          ordenarPorDefecto('rechazado', response);
        } else {
          ordenarPorDefecto('reportado', response);
        }
      } else {
        // BASIC: Filtrar solo sus preguntas + aprobadas
        let filteredQuestions = response;
        
        filteredQuestions = filteredQuestions.filter(
          (question: Question) =>
            question.author.id === userID || // Hechas por ti
            question.IsAproved === true // O preguntas aprobadas
        );
        
        setQuestions(filteredQuestions);
      }
      
      hasLoadedQuestions.current = true;
    } catch (error: any) {
      // ✅ Usa tu manejador de errores (reemplaza los Swal.fire)
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, user, userID, filterAprove, logout]);

  /**
   * 4️⃣ Ordenar por estado (cuando usuario cambia filtro) - IGUAL QUE EL ORIGINAL
   */
  const ordenarPorEstado = useCallback((estado: string) => {
    const preguntasOrdenadas = [...questions].sort((a, b) => {
      if (estado === 'aprobado') {
        if (a.IsAproved && !b.IsAproved) return -1;
        if (!a.IsAproved && b.IsAproved) return 1;
      } else if (estado === 'reportado') {
        if (a.isReported && !b.isReported) return -1;
        if (!a.isReported && b.isReported) return 1;
      } else if (estado === 'rechazado') {
        if (!a.IsAproved && b.IsAproved) return -1;
        if (a.IsAproved && !b.IsAproved) return 1;
      }
      return 0;
    });
    
    // Actualizar filtros
    if (estado === 'aprobado') {
      setFilterAprove(true);
      setFilterReport(false);
    } else if (estado === 'reportado') {
      setFilterReport(true);
      setFilterAprove(null);
    } else if (estado === 'rechazado') {
      setFilterAprove(false);
      setFilterReport(false);
    }
    
    setQuestions(preguntasOrdenadas);
  }, [questions]);

  /**
   * 5️⃣ Filtrar por búsqueda - IGUAL QUE EL ORIGINAL
   */
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) =>
      question.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, searchQuery]);

  /**
   * 6️⃣ Preparar datos para la tabla
   */
  const tableRows = useMemo(() => {
    return filteredQuestions.map((question) => ({
      id: question.id,
      category: question.category?.category || 'Sin categoría',
      text: question.text || '',
      answers: question.answers?.map((res) => res.text).join(', ') || '',
      IsAproved: question.IsAproved,
      isReported: question.isReported,
      author: question.author,
      fullQuestion: question,
    }));
  }, [filteredQuestions]);

  /**
   * 7️⃣ Cargar preguntas cuando hay token o update cambia
   */
  useEffect(() => {
    if (token) {
      hasLoadedQuestions.current = false; // Permitir recarga
      getQuestions();
    }
  }, [token, update, getQuestions]);

  /**
   * 8️⃣ Función para actualizar (después de aprobar/eliminar/etc)
   */
  const triggerUpdate = useCallback(() => {
    setUpdate((prev) => !prev);
    hasLoadedQuestions.current = false;
  }, []);

  return {
    // Estados
    questions: filteredQuestions,
    tableRows,
    loading,
    token,
    userID,
    user,
    filterAprove,
    filterReport,
    
    // Funciones
    ordenarPorEstado,
    triggerUpdate,
  };
};