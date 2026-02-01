import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getColumnsCategorias } from "@/lib/constants/ColumnsTable/categoryColumnsConfig";
import {
  getAllQuestionCategoriesEndpoint,
  deleteQuestionCategoryEndpoint,
  type QuestionCategory
} from "@/lib/api/Questions";
import { showAlert, showConfirm } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import { useAuthData } from "@/lib/hooks/useAuthData";

export const useCategoriasLogic = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasInitialized = useRef(false);
  const itemsPerPage = 4;

  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthData();


  const token = useMemo(() => {
    return localStorage.getItem("authToken") ||
      localStorage.getItem("cnrsms_token") ||
      "";
  }, []);

  //  Función para obtener categorías 
  const getCategories = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllQuestionCategoriesEndpoint(token);
      setCategories(response);
      setCurrentPage(1);
    } catch (error: any) {
      console.error("Error al obtener categorías:", error);

      if (error.response?.data?.message === "Token expirado" ||
        error.response?.status === 401) {
        await showAlert(
          "Sesión Expirada",
          "Por favor, inicia sesión nuevamente",
          "error"
        );
        logout();
        return;
      }

      showAlert(
        "Error",
        "No se pudieron cargar las categorías. Intenta de nuevo.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (hasInitialized.current && refreshKey === 0) return;

    if (!token) return; // Solo retorna si NO hay token, espera a que se cargue

    hasInitialized.current = true;
    getCategories();
  }, [refreshKey, token]);

  // Función para refrescar categorías
  const refreshCategories = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Eliminar categoría
  const deleteCategory = useCallback(async (id: string) => {
    if (!token) return;

    try {
      await deleteQuestionCategoryEndpoint(id, token);

      await showAlert(
        "Éxito",
        "Categoría eliminada correctamente",
        "success"
      );

      // Refrescar lista sin recargar página
      refreshCategories();
    } catch (error: any) {
      console.error("Error al eliminar categoría:", error);

      if (error.response?.data?.message === "Token expirado" ||
        error.response?.status === 401) {
        await showAlert(
          "Sesión Expirada",
          "Por favor, inicia sesión nuevamente",
          "error"
        );
        logout();
        return;
      }

      showAlert(
        "Error",
        "No se pudo eliminar la categoría. Intenta de nuevo.",
        "error"
      );
    }
  }, [token, logout, refreshCategories]);

  // Confirmar eliminación
  const confirmDelete = useCallback((id: string | number) => {
    showConfirm(
      "¿Estás Seguro?",
      "Esta acción no se puede deshacer",
      "Eliminar",
      () => deleteCategory(String(id))
    );
  }, [deleteCategory]);

  // Filtrar categorías 
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((category) =>
      category.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);



  // Total de páginas 
  const totalPages = useMemo(() => {
    return Math.ceil(filteredCategories.length / itemsPerPage);
  }, [filteredCategories.length, itemsPerPage]);

  //  Columnas de tabla
  const columns = useMemo(
    () => getColumnsCategorias(token, confirmDelete, refreshCategories),
    [token, user, confirmDelete, refreshCategories]
  );

  return {

    filteredCategories,
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    columns,
    refreshCategories
  };
};