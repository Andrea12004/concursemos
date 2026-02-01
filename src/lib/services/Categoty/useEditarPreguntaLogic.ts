import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { updateQuestionCategoryEndpoint, type QuestionCategory } from "@/lib/api/Questions";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";


interface FormData {
  nombre: string;
  imagen2: File | string;
}

interface UseEditarPreguntaLogicProps {
  pregunta: QuestionCategory;
  token: string;
  onSuccess?: () => void;
}

export const useEditarPreguntaLogic = ({ 
  pregunta, 
  token, 
  onSuccess 
}: UseEditarPreguntaLogicProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { logout } = useLogout();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    nombre: pregunta.category,
    imagen2: pregunta.photo_category,
  });

  const [nameFile, setNameFile] = useState<string>(
    pregunta.photo_category.replace('https://api.backconcursemos.com/upload/questions_category/', '')
  );

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Actualizar datos cuando cambia la pregunta
  useEffect(() => {
    if (pregunta) {
      setFormData({
        nombre: pregunta.category,
        imagen2: pregunta.photo_category,
      });
      setNameFile(
        pregunta.photo_category.replace('https://api.backconcursemos.com/upload/questions_category/', '')
      );
    }
  }, [pregunta]);

  // Función para manejar el cambio en los campos
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, files, value, type } = e.target;

    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(file.type)) {
        showAlert(
          "Advertencia",
          "Formato de archivo no válido. Solo se aceptan imágenes JPEG o PNG",
          "warning"
        );
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setNameFile(file.name);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nombre || !formData.imagen2) {
      showAlert(
        "Error",
        "Por favor completa todos los campos y adjunta una imagen",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("category", formData.nombre);

      if (formData.imagen2 !== pregunta.photo_category) {
        formDataToSend.append("file", formData.imagen2 as File);
      }

      const response = await updateQuestionCategoryEndpoint(
        pregunta.id,
        formDataToSend,
        token
      );

      if (response.message && response.message.includes("duplicate key value violates unique constraint")) {
        showAlert(
          "Error",
          "Esta categoría ya está registrada",
          "error"
        );
        return;
      }

      await showAlert(
        "Operación Exitosa",
        `Categoría ${formData.nombre} modificada con éxito`,
        "success"
      );

      setIsOpen(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        location.reload();
      }
    } catch (error: any) {
      console.error("Error al editar categoría:", error);

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
        "Estamos teniendo fallas técnicas al editar la categoría",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, pregunta, token, logout, onSuccess]);

  return {
    isOpen,
    setIsOpen,
    isLoading,
    formData,
    nameFile,
    handleChange,
    handleSubmit,
  };
};