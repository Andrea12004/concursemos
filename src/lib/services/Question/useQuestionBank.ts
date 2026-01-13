import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllQuestionsEndpoint } from '@/lib/api/Questions';
import { showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';
import type { Question } from '@/lib/types/questionBank';

export const useQuestionBank = ({ searchQuery = '' }: { searchQuery?: string } = {}) => {
  const { logout } = useLogout();
  
  // Estados del usuario
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<string | number>('');
  const [user, setUser] = useState<any>(null);
  
  // Estados de las preguntas
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [update, setUpdate] = useState<boolean>(false);
  
  // Estados de filtros
  const [filterAprove, setFilterAprove] = useState<boolean | null>(true);
  const [filterReport, setFilterReport] = useState<boolean>(false);
  
  // 1️⃣ Cargar token y usuario del localStorage
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

  // 2️⃣ Función para ordenar preguntas por defecto
  const ordenarPorDefecto = useCallback((estado: string, questions: Question[]) => {
    const preguntasOrdenadas = [...questions];
    
    if (estado === "aprobado") {
      // Ordenar por "Aprobado": Solo las preguntas aprobadas
      preguntasOrdenadas.sort((a, b) => {
        if (a.IsAproved && !b.IsAproved) return -1;
        if (!a.IsAproved && b.IsAproved) return 1;
        return 0;
      });
      setFilterAprove(true);
      setFilterReport(false);
    } else if (estado === "reportado") {
      // Ordenar por "Reportado": Solo las preguntas reportadas
      preguntasOrdenadas.sort((a, b) => {
        if (a.isReported && !b.isReported) return -1;
        if (!a.isReported && b.isReported) return 1;
        return 0;
      });
      setFilterReport(true);
      setFilterAprove(null);
    } else if (estado === "rechazado") {
      // Ordenar por "Rechazado": Solo las preguntas no aprobadas
      preguntasOrdenadas.sort((a, b) => {
        if (!a.IsAproved && b.IsAproved) return -1;
        if (a.IsAproved && !b.IsAproved) return 1;
        return 0;
      });
      setFilterAprove(false);
      setFilterReport(false);
    }
    
    return preguntasOrdenadas;
  }, []);

  // 3️⃣ Obtener preguntas desde la API
  const getQuestions = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    
    try {
      const data = await getAllQuestionsEndpoint(token);
      
      // Aplicar lógica según rol del usuario
      if (user?.role === 'ADMIN') {
        let sortedQuestions = data;
        
        if (filterAprove === true) {
          sortedQuestions = ordenarPorDefecto('aprobado', data);
        } else if (filterAprove === false) {
          sortedQuestions = ordenarPorDefecto('rechazado', data);
        } else {
          sortedQuestions = ordenarPorDefecto('reportado', data);
        }
        
        setAllQuestions(sortedQuestions);
      } else {
        // BASIC: Filtrar solo sus preguntas o preguntas aprobadas
        let filteredQuestions = data.filter((question: Question) => 
          question.author.id === userID || question.IsAproved === true
        );
        
        setAllQuestions(filteredQuestions);
      }
      
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      
      if (error?.response?.data?.message === "Token expirado") {
        showAlert(
          "Token Expirado",
          "Vuelve a ingresar a la plataforma",
          "error"
        ).then(() => {
          logout();
        });
      } else {
        showAlert(
          "Error",
          "Estamos teniendo fallas técnicas",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [token, user?.role, userID, filterAprove, ordenarPorDefecto, logout]);

  // 4️⃣ Cargar preguntas cuando cambia el token o update
  useEffect(() => {
    if (token) {
      getQuestions();
    }
  }, [token, update, getQuestions]);

  // 5️⃣ Función para ordenar por estado
  const ordenarPorEstado = useCallback((estado: string) => {
    const preguntasOrdenadas = ordenarPorDefecto(estado, allQuestions);
    setAllQuestions(preguntasOrdenadas);
  }, [allQuestions, ordenarPorDefecto]);

  // 6️⃣ Filtrar preguntas por búsqueda
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return allQuestions;
    
    return allQuestions.filter(question =>
      question.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.category?.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allQuestions, searchQuery]);

  // 7️⃣ Preparar filas para la tabla
  const tableRows = useMemo(() => {
    return filteredQuestions.map((question) => ({
      id: question.id,
      category: question.category?.category || 'Sin categoría',
      text: question.text || '',
      answers: question.answers?.map((res) => res.text).join(', ') || '',
      IsAproved: question.IsAproved || false,
      isReported: question.isReported || false,
      author: question.author,
      fullQuestion: question,
    }));
  }, [filteredQuestions]);

  // 8️⃣ Función para actualizar la lista
  const triggerUpdate = useCallback(() => {
    setUpdate(prev => !prev);
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
    getQuestions, // Exportar también getQuestions si es necesario
    
    // Datos adicionales
    totalQuestions: allQuestions.length,
    filteredCount: filteredQuestions.length,
  };
};