import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import type { User } from "@/lib/types/user";
import "./css/edit.css";
import "@/components/UI/Button/styles.css";
/* Props del componente (usando tipo compartido) */
interface CrearUsuarioProps {
  item: User;
  token?: string; // por ahora opcional (maqueta)
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

const Crearusuario: React.FC<CrearUsuarioProps> = ({ item }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    rol: "",
    password: "",
    password2: "",
  });

  // Controlar la visibilidad del modal con estado (en lugar de manipular el DOM)
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  /* Envío del formulario (mock) */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.telefono ||
      !formData.email ||
      !formData.rol
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // 👉 MAQUETA: aquí luego conectas el backend
    console.log("Datos enviados:", formData);

    Swal.fire({
      title: "Éxito",
      text: "Usuario editado (maqueta)",
      icon: "success",
      confirmButtonText: "Ok",
    });

    // Cerrar modal (usando estado)
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className=""
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={`edit-modal-${item.id}`}
        onClick={() => setIsOpen(true)}
      >
        <img src="/svg/usuarios/editar.svg" alt="Editar Usuario" />
      </button>

      {/* Modal — renderizado con Portal para salir del árbol de la tabla */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={item.id}
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
                  <button type="button" onClick={() => setIsOpen(false)}>
                    <img src="/svg/modals/close.svg" alt="Close" />
                  </button>
                </div>

                <div className="modal-body p-4">
                  <form
                    className="w-full flex flex-row gap-2 flex-wrap justify-center"
                    onSubmit={(e) => {
                      handleSubmit(e);
                      setIsOpen(false);
                    }}
                  >
                    <div className="div-inputs-form">
                      <img src="/svg/modals/nombre.svg" alt="" />
                      <input
                        type="text"
                        className="inputs-form-crear-usuario"
                        placeholder="Nombre y Apellido"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="div-inputs-form">
                      <img src="/svg/modals/tel.svg" alt="" />
                      <input
                        type="text"
                        className="inputs-form-crear-usuario"
                        placeholder="Teléfono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="div-inputs-form">
                      <img src="/svg/modals/email.svg" alt="" />
                      <input
                        type="email"
                        className="inputs-form-crear-usuario"
                        placeholder="Correo electrónico"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="div-inputs-form">
                      <img src="/svg/modals/rol.svg" alt="" />
                      <select
                        name="rol"
                        className="inputs-form-crear-usuario"
                        value={formData.rol}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Rol
                        </option>
                        <option value="ADMIN">Administrador</option>
                        <option value="BASIC">Cliente</option>
                      </select>
                    </div>

                                     <div className="w-full modal-footer flex ">

                      <button
                        type="button"
                        className="button-close-modal"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="button-send-modal ">
                        Editar
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

export default Crearusuario;
