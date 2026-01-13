import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, FormEvent } from "react";
import type { User } from "@/lib/types/user";
import { updateUserEndpoint } from "@/lib/api/users";
import { showAlert } from "@/lib/utils/showAlert";
import "./css/edit.css";
import "@/components/UI/Button/styles.css";
import Button from '@/components/UI/Button/button';
import ImageButton from '@/components/UI/Button/ImageButton';
import { Input } from "@/components/UI/Inputs/input";

/* Props del componente */
interface CrearUsuarioProps {
  item: User;
  token: string;
}

/* Tipado del formulario */
interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  rol: string;
  password: string;
  password2: string;
}

const Crearusuario: React.FC<CrearUsuarioProps> = ({ item, token }) => {
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
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Envío del formulario */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      // Cerrar modal y recargar página
      setIsOpen(false);
      location.reload();
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
  };

  return (
    <>
      <ImageButton
        type="button"
        className=""
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={`edit-modal-${item.id}`}
        onClick={() => setIsOpen(true)}
      >
        <img src="/svg/usuarios/editar.svg" alt="Editar Usuario" />
      </ImageButton>

      {/* Modal — renderizado con Portal */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={`edit-modal-${item.id}`}
            className="overlay modal fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-start pt-16"
            role="dialog"
            tabIndex={-1}
            onClick={(e) => {
              // cerrar al hacer click fuera del dialog
              if ((e.target as HTMLElement).id === `edit-modal-${item.id}`) {
                setIsOpen(false);
              }
            }}
          >
            <div className="modal-dialog w-full max-w-3xl rounded-lg shadow-lg mx-4">
              <div className="bg-white rounded-md overflow-hidden">
                <div className="modal-header flex justify-between items-center p-4 ">
                  <h3 className="modal-title text-white">Editar Usuario</h3>
                  <ImageButton 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    className="icon-sm"
                  >
                    <img src="/svg/modals/close.svg" alt="Close" />
                  </ImageButton>
                </div>

                <div className="modal-body p-4">
                  <form
                    className="w-full flex flex-row gap-2 flex-wrap justify-center"
                    onSubmit={handleSubmit}
                  >
                    <div className="div-inputs-form">
                      <img src="/svg/modals/nombre.svg" alt="" />
                      <Input
                        className="inputs-form-crear-usuario"
                        placeholder="Nombre y Apellido"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="div-inputs-form">
                      <img src="/svg/modals/tel.svg" alt="" />
                      <Input
                        className="inputs-form-crear-usuario"
                        placeholder="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="div-inputs-form">
                      <img src="/svg/modals/email.svg" alt="" />
                      <Input
                        className="inputs-form-crear-usuario"
                        placeholder="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="div-inputs-form">
                      <img src="/svg/modals/rol.svg" alt="" />
                      <select
                        name="rol"
                        className="inputs-form-crear-usuario"
                        value={formData.rol}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Rol
                        </option>
                        <option value="ADMIN">Administrador</option>
                        <option value="BASIC">Cliente</option>
                      </select>
                    </div>

                    <div className="w-full modal-footer flex ">
                       <Button
                        type="button"
                        className="button-close-modal"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="button-send-modal ">
                        Editar
                      </Button>
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

export default Crearusuario;