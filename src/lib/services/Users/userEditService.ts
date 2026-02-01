import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { User } from "@/lib/types/user";
import { updateUserEndpoint } from "@/lib/api/users";
import { showAlert } from "@/lib/utils/showAlert";

interface CrearUsuarioLogicProps {
  item: User;
  token: string;
  onSuccess?: () => void; // ✅ Callback para actualizar sin reload
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  rol: string;
  password: string;
  password2: string;
}

export const useCrearUsuarioLogic = ({ item, token, onSuccess }: CrearUsuarioLogicProps) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    rol: "",
    password: "",
    password2: "",
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Cargar datos del usuario al abrir el modal
  useEffect(() => {
    if (item) {
      setFormData({
        nombre: item.firstName ?? "",
        email: item.email ?? "",
        telefono: item.lastName ?? "",
        ciudad: (item as any).city ?? item.profile?.City ?? "",
        rol: item.role,
        password: "",
        password2: "",
      });
    }
  }, [item]);

  /* Manejo de inputs */
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* Envío del formulario */
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (
      !formData.nombre ||
      !formData.telefono ||
      !formData.email ||
      !formData.rol
    ) {
      showAlert(
        "Error",
        "Por favor llena todos los campos",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Llamada al servicio de API
      await updateUserEndpoint(
        item.id,
        {
          firstName: formData.nombre,
          lastName: formData.telefono,
          email: formData.email,
          role: formData.rol,
        },
        token
      );

      // Mostrar mensaje de éxito
      await showAlert(
        "Éxito",
        "Usuario editado correctamente",
        "success"
      );

      // Cerrar modal
      setIsOpen(false);

      // ✅ Llamar callback en lugar de location.reload()
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
      showAlert(
        "Error",
        "Estamos teniendo fallas técnicas. Por favor intenta de nuevo.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, item.id, token, onSuccess]);

  return {
    formData,
    isOpen,
    isLoading,
    setIsOpen,
    handleChange,
    handleSubmit
  };
};