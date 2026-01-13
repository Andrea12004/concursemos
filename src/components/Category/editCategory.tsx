import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, FormEvent } from "react";
import { updateQuestionCategoryEndpoint, type QuestionCategory } from "@/lib/api/Questions";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";

interface EditarPreguntaProps {
  pregunta: QuestionCategory;
  token: string;
  profile?: any;
}

interface FormData {
  nombre: string;
  imagen2: File | string;
}

const EditarPregunta: React.FC<EditarPreguntaProps> = ({ pregunta, token, profile }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { logout } = useLogout();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    nombre: pregunta.category,
    imagen2: pregunta.photo_category,
  });

  const [nameFile, setNameFile] = useState<string>(
    pregunta.photo_category.replace('http://api.backconcursemos.com/upload/questions_category/', '')
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
        pregunta.photo_category.replace('http://api.backconcursemos.com/upload/questions_category/', '')
      );
    }
  }, [pregunta]);

  // Función para manejar el cambio en los campos
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

      // Guardar el archivo en el estado
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setNameFile(file.name);
    } else {
      // Manejar otros campos
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      // Crear FormData
      const formDataToSend = new FormData();
      formDataToSend.append("category", formData.nombre);

      // Solo añadir el archivo si es diferente al original
      if (formData.imagen2 !== pregunta.photo_category) {
        formDataToSend.append("file", formData.imagen2 as File);
      }

      // Llamar al servicio
      const response = await updateQuestionCategoryEndpoint(
        pregunta.id,
        formDataToSend,
        token
      );

      // Verificar si hay error de duplicado
      if (response.message && response.message.includes("duplicate key value violates unique constraint")) {
        showAlert(
          "Error",
          "Esta categoría ya está registrada",
          "error"
        );
        return;
      }

      // Mostrar mensaje de éxito
      await showAlert(
        "Operación Exitosa",
        `Categoría ${formData.nombre} modificada con éxito`,
        "success"
      );

      // Cerrar modal y recargar
      setIsOpen(false);
      location.reload();
    } catch (error: any) {
      console.error("Error al editar categoría:", error);

      // Manejar token expirado
      if (error.response?.data?.message === "Token expirado") {
        await showAlert(
          "Inicio de sesión expirado",
          "Vuelve a ingresar a la plataforma",
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
  };

  return (
    <>
      <button
        type="button"
        className="editar-button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        Editar
        <img
          src="/svg/banco/editar.svg"
          alt="Editar"
          className="nohover-banco"
        />
        <img
          src="/svg/banco/editar-hover.svg"
          alt="Editar"
          className="hover-banco"
        />
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={`edit-category-${pregunta.id}`}
            className="overlay modal fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            role="dialog"
            tabIndex={-1}
            onClick={(e) => {
              // Cerrar modal si se hace clic fuera del contenido
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <div className="modal-dialog w-full max-w-3xl rounded-lg shadow-lg">
              <div className="modal-content" style={{ backgroundColor: "#1F2336" }}>
                <div className="modal-header flex justify-between items-center p-4 border-gray-700">
                  <h3 className="modal-title text-white" style={{ color: "#FFF" }}>
                    Editar Categoría
                  </h3>
                  <button
                    type="button"
                    className="btn btn-text btn-circle btn-sm"
                    aria-label="Close"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    <img src="/svg/modals/close.svg" alt="Close" />
                  </button>
                </div>

                <div className="modal-body p-4">
                  <form
                    className="w-full h-full flex flex-row gap-2 flex-wrap justify-start mb-4 mt-2"
                    onSubmit={handleSubmit}
                  >
                    <h6 className="titulos-azules">Nombre de la categoría</h6>
                    <input
                      className="inputs-categorias"
                      type="text"
                      placeholder="Nombre de Categoría"
                      required
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      disabled={isLoading}
                    />

                    <h6 className="titulos-azules">Imagen destacada</h6>
                    <label htmlFor={`imagen2-${pregunta.id}`} className="inputs-categorias flex cursor-pointer">
                      <p>
                        {formData.imagen2 && nameFile
                          ? nameFile
                          : "Selecciona una imagen destacada, de máximo 1mb y con las medidas de 400x200"}
                      </p>
                      <img src="/svg/modals/file.svg" alt="" />
                    </label>
                    <input
                      className="inputs-categorias hidden"
                      id={`imagen2-${pregunta.id}`}
                      type="file"
                      accept="image/*"
                      name="imagen2"
                      onChange={handleChange}
                      disabled={isLoading}
                    />

                    <div className="w-full modal-footer">
                      <button
                        type="button"
                        className="button-close-modal"
                        aria-label="Close"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="button-send-modal"
                        disabled={isLoading}
                      >
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EditarPregunta;