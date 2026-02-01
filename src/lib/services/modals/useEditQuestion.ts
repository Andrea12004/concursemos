import { useState, useEffect, useCallback, useRef } from "react";
import { useLogout } from "@/lib/hooks/useLogout";
import { showAlert } from "@/lib/utils/showAlert";
import { updateQuestionEndpoint, getAllQuestionCategoriesEndpoint } from "@/lib/api/Questions";
import type { Question as QuestionType } from "@/lib/types/questionBank";

interface Category {
  id: string | number;
  category: string;
  photo_category: string;
}

interface EditarPreguntaLogicProps {
  pregunta: QuestionType;
  token: string;
  onQuestionUpdated?: () => void; 
}

export const useEditarPreguntaLogic = ({ pregunta, token, onQuestionUpdated }: EditarPreguntaLogicProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLogout();
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, _setRefreshKey] = useState(0); 
  const hasInitialized = useRef(false); 
  
  const [formData, setFormData] = useState({
    Preguntaedit: pregunta.text,
    Categoriaedit: pregunta.category.id,
    Respuesta1edit: pregunta.answers[0]?.text || "",
    Respuesta2edit: pregunta.answers[1]?.text || "",
    Respuesta3edit: pregunta.answers[2]?.text || "",
    Respuesta4edit: pregunta.answers[3]?.text || "",
    CorrectAnsweredit: pregunta.answers[0]?.isCorrect === true 
      ? 'Respuesta1edit' 
      : pregunta.answers[1]?.isCorrect === true 
      ? 'Respuesta2edit' 
      : pregunta.answers[2]?.isCorrect === true 
      ? 'Respuesta3edit' 
      : pregunta.answers[3]?.isCorrect === true 
      ? 'Respuesta4edit' 
      : '',
  });

  // Manejar cambios en inputs
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Enviar formulario
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.CorrectAnsweredit ||
      !formData.Preguntaedit ||
      !formData.Categoriaedit ||
      !formData.Respuesta1edit ||
      !formData.Respuesta2edit ||
      !formData.Respuesta3edit ||
      !formData.Respuesta4edit
    ) {
      showAlert("Error", "Por favor llena todos los campos", "warning");
      return;
    }

    try {
      const response = await updateQuestionEndpoint(
        pregunta.id,
        {
          text: formData.Preguntaedit,
          IsAproved: pregunta.IsAproved ?? false,
          isReported: pregunta.isReported ?? false,
          answers: [
            {
              text: formData.Respuesta1edit,
              isCorrect: formData.CorrectAnsweredit === "Respuesta1edit",
            },
            {
              text: formData.Respuesta2edit,
              isCorrect: formData.CorrectAnsweredit === "Respuesta2edit",
            },
            {
              text: formData.Respuesta3edit,
              isCorrect: formData.CorrectAnsweredit === "Respuesta3edit",
            },
            {
              text: formData.Respuesta4edit,
              isCorrect: formData.CorrectAnsweredit === "Respuesta4edit",
            },
          ],
          categoryId: formData.Categoriaedit,
        },
        token
      );

      if (
        response.data?.message &&
        response.data.message.includes("duplicate key value violates unique constraint")
      ) {
        showAlert("Error", "Esta pregunta ya está registrada", "error");
        return;
      }

      await showAlert(
        "Operación Exitosa",
        `Pregunta editada con éxito`,
        "success"
      );
      
      // Llamar callback en lugar de recargar
      if (onQuestionUpdated) {
        onQuestionUpdated();
      }
      
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
      showAlert("Error", "Estamos teniendo fallas técnicas", "error");
    }
  }, [formData, pregunta.id, pregunta.IsAproved, pregunta.isReported, token, onQuestionUpdated]);

  
  const getCategories = useCallback(async () => {
    try {
      const response = await getAllQuestionCategoriesEndpoint(token);
      setCategories(response);
    } catch (error: any) {
      if (error?.response?.data?.message === "Token expirado") {
        await showAlert(
          "Inicio de sesión expirado",
          "Vuelve a ingresar a la plataforma",
          "error"
        );
        logout();
        return;
      }
      showAlert("Error", "Estamos teniendo fallas técnicas", "error");
    }
  }, [token, logout]);


  useEffect(() => {
    if (!token) return;
    if (hasInitialized.current && refreshKey === 0) return;
    
    hasInitialized.current = true;
    getCategories();
  }, [refreshKey]); 

  return {
    isOpen,
    setIsOpen,
    categories,
    formData,
    handleChange,
    handleSubmit,
  };
};