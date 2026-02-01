import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getAllQuestionsEndpoint } from '@/lib/api/Questions';
import { showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';
import { useAuthData } from '@/lib/hooks/useAuthData';
import type { Question } from '@/lib/types/questionBank';

interface UseQuestionBankProps {
  searchQuery?: string;
}

export const useQuestionBank = ({ searchQuery = '' }: UseQuestionBankProps = {}) => {
  const { logout } = useLogout();
  const { user: authUser } = useAuthData();

  // Estados
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [filterAprove, setFilterAprove] = useState<boolean | null>(null);
  const [filterReport, setFilterReport] = useState<boolean>(false);

  const hasInitialized = useRef(false);

  // Token
  const token = useMemo(() => {
    return localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      '';
  }, []);

  // Usuario
  const userID = useMemo(() => authUser?.profile?.id || '', [authUser?.profile?.id]);
  const user = useMemo(() => authUser, [authUser]);


  const getQuestions = useCallback(async () => {
    const currentToken = localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      '';

    if (!currentToken) return;

    setLoading(true);


    try {
      const data = await getAllQuestionsEndpoint(currentToken);

      // Filtrar preguntas válidas
      const validQuestions = (data || []).filter((q: any) => q && q.id);
      const currentUserRole = authUser?.role || 'BASIC';
      const currentUserID = authUser?.profile?.id || '';


      let questionsToSet: Question[] = [];

      if (currentUserRole === 'ADMIN') {
        questionsToSet = validQuestions;
      } else {
        questionsToSet = validQuestions.filter((question: Question) => {
          const isOwnQuestion = question.author?.id === currentUserID;
          const isApprovedQuestion = question.IsAproved === true;

          return isOwnQuestion || isApprovedQuestion;
        });
      }

      setOriginalQuestions(questionsToSet);
      setAllQuestions(questionsToSet);

    } catch (error: any) {


      if (error?.response?.data?.message === "Token expirado") {
        showAlert(
          "Token Expirado",
          "Vuelve a ingresar a la plataforma",
          "error"
        ).then(() => {
          logout();
        });
      }
    } finally {
      setLoading(false);
    }
  }, [logout, authUser]);


  useEffect(() => {
    if (!token) return;


    // Solo ejecutar una vez al montar O cuando refreshKey cambia
    if (hasInitialized.current && refreshKey === 0) {

    }

    hasInitialized.current = true;
    getQuestions();

    // Reset filters when data refreshes
    setFilterAprove(null);
    setFilterReport(false);
  }, [token, refreshKey]);


  const ordenarPorEstado = useCallback((estado: string) => {
    let ordenadas = [...originalQuestions];

    // ORDENAR 
    if (estado === "aprobado") {
      // Aprobadas primero
      ordenadas = ordenadas.sort((a, b) => {
        if (a.IsAproved && !b.IsAproved) return -1;
        if (!a.IsAproved && b.IsAproved) return 1;
        return 0;
      });
      setFilterAprove(true);
      setFilterReport(false);
    } else if (estado === "reportado") {
      // Reportadas primero
      ordenadas = ordenadas.sort((a, b) => {
        if (a.isReported && !b.isReported) return -1;
        if (!a.isReported && b.isReported) return 1;
        return 0;
      });
      setFilterReport(true);
      setFilterAprove(null);
    } else if (estado === "rechazado") {
      // Desaprobadas primero
      ordenadas = ordenadas.sort((a, b) => {
        if (!a.IsAproved && b.IsAproved) return -1;
        if (a.IsAproved && !b.IsAproved) return 1;
        return 0;
      });
      setFilterAprove(false);
      setFilterReport(false);
    }

    setAllQuestions(ordenadas);
  }, [originalQuestions]);

  // Disparar actualización
  const triggerUpdate = useCallback(() => {
    setRefreshKey(prev => {
      const newValue = prev + 1;
      return newValue;
    });
  }, []);

  // Filtrar por búsqueda
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return allQuestions;

    return allQuestions.filter(question => {
      if (!question) return false;
      return (
        question.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.category?.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [allQuestions, searchQuery]);

  // Preparar filas
  const tableRows = useMemo(() => {
    return filteredQuestions
      .filter(q => q)
      .map((question) => ({
        id: question.id,
        text: question.text || '',
        category: question.category?.category || 'Sin categoría',
        author: question.author || { id: '' },
        IsAproved: question.IsAproved || false,
        isReported: question.isReported || false,
        createdAt: question.createdAt || '',
        updatedAt: question.updatedAt || '',
        answers: question.answers?.map((ans: any) => ans?.text).filter(Boolean).join(', ') || '',
        fullQuestion: question,
      }));
  }, [filteredQuestions]);

  return {
    tableRows,
    token,
    userID,
    user,
    filterAprove,
    filterReport,
    questions: allQuestions,
    loading,
    ordenarPorEstado,
    triggerUpdate,
  };
};