import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLogout } from "@/lib/hooks/useLogout";
import { useAuthData } from "@/lib/hooks/useAuthData";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { getAllQuestionCategoriesEndpoint } from "@/lib/api/Questions";
import { useCarruselSettings } from "@/lib/hooks/UsecarouselCreate";

interface Category {
  id: string | number;
  category: string;
  photo_category?: string;
}

interface UseCarruselLogicProps {
  onSelectCategory: (categoryIds: (string | number)[]) => void;
  allCategories: boolean;
  searchQuery: string;
  onReload?: () => void; 
}

export const useCarruselLogic = ({ 
  onSelectCategory, 
  allCategories, 
  searchQuery,
  onReload 
}: UseCarruselLogicProps) => {
  const { logout } = useLogout();
  const { user } = useAuthData();
  
  const hasLoaded = useRef(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const token = useMemo(() => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('cnrsms_token') || 
           '';
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(false);

  const { randomGradients, sliderSettings } = useCarruselSettings(categories);

  // Obtener categorías del backend
  const getCategories = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllQuestionCategoriesEndpoint(token);
      setCategories(response);
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Cargar categorías SOLO al montar O cuando refreshKey cambia
  useEffect(() => {
    if (!token) return;
    if (hasLoaded.current && refreshKey === 0) return;
    
    hasLoaded.current = true;
    getCategories();
  }, [refreshKey]); 


  const refreshCategories = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    
    if (onReload) {
      onReload();
    }
  }, [onReload]); 

  // NO poner onSelectCategory en dependencias
  useEffect(() => {
    if (allCategories && categories.length > 0) {
      const allCategoryIds = categories.map(category => category.id);
      setSelectedCategories(allCategoryIds);
      onSelectCategory(allCategoryIds);
    } else if (!allCategories && selectedCategories.length > 0) {
      setSelectedCategories([]);
      onSelectCategory([]);
    }
  }, [allCategories, categories.length]); 

  // Seleccionar o deseleccionar categoría individual
  const selectCategory = useCallback((id: string | number) => {
    setSelectedCategories(prev => {
      const newSelectedCategories = prev.includes(id)
        ? prev.filter(categoryId => categoryId !== id) 
        : [...prev, id];
      
      onSelectCategory(newSelectedCategories);
      return newSelectedCategories;
    });
  }, [onSelectCategory]);

  // Callback para cuando se elimina una categoría
  const handleCategoryDeleted = useCallback(() => {
    refreshCategories();
  }, [refreshCategories]);

  // Filtrar categorías según búsqueda
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter(category => 
      category.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  return {
    categories,
    selectedCategories,
    token,
    user,
    loading,
    randomGradients,
    sliderSettings,
    selectCategory,
    handleCategoryDeleted,
    filteredCategories,
    refreshCategories 
  };
};
