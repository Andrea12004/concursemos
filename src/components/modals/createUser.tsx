import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Swal from "sweetalert2";
import "./css/styles.css";
import { Input } from '@/components/UI/Inputs/input';
import "@/components/UI/Button/styles.css";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  nickname: string;
  rol: string;
  password: string;
  password2: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  blocked: boolean;
  authStrategy: string;
}

interface ProfileData {
  userId: string;
  nickname: string;
  City: string;
}

const Crearusuario: React.FC = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    nickname: "",
    rol: "",
    password: "",
    password2: "",
  });

  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Función para manejar el cambio en los campos
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para abrir/cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Función para manejar el envío del formulario (simulado)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de campos vacíos
    const camposRequeridos: (keyof FormData)[] = [
      "nombre",
      "telefono",
      "email",
      "password",
      "ciudad",
      "nickname",
      "rol",
      "password2",
    ];
    const camposVacios = camposRequeridos.filter(
      (campo) => formData[campo].trim() === ""
    );

    if (camposVacios.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Validación de contraseñas
    if (formData.password !== formData.password2) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Validación de email (opcional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa un email válido",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    try {
      // Simulación de datos para la API
      const userData: UserData = {
        firstName: formData.nombre,
        lastName: formData.telefono,
        email: formData.email,
        password: formData.password,
        role: formData.rol,
        blocked: false,
        authStrategy: "BASIC",
      };

      console.log("Datos del usuario a enviar:", userData);

      // Simulación de respuesta exitosa
      const mockUserId = Math.random().toString(36).substring(2, 9);

      // Aquí iría la llamada real a la API:
      // const response = await axios.post('users/register', userData);

      // Simular creación del perfil
      const profileData: ProfileData = {
        userId: mockUserId,
        nickname: formData.nickname,
        City: formData.ciudad,
      };

      console.log("Datos del perfil a enviar:", profileData);

      // Mostrar éxito
      Swal.fire({
        title: "Operación Exitosa",
        text: "Usuario creado correctamente",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        // Resetear formulario
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          ciudad: "",
          nickname: "",
          rol: "",
          password: "",
          password2: "",
        });

        // Cerrar modal
        setIsModalOpen(false);

        // Recargar página (simulación)
        // location.reload();
        // En lugar de recargar, podrías actualizar el estado de la lista de usuarios aquí
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);

      // Manejo de errores simulados
      if (Math.random() > 0.5) {
        // Simular error duplicado aleatoriamente
        Swal.fire({
          title: "Error",
          text: "Este usuario ya está registrado",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Estamos teniendo fallas técnicas",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="button-question-usuarios flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="slide-down-animated-modal"
        onClick={toggleModal}
      >
        <img src="/svg/header/agregarheaderblanco.svg" alt="Crear Usuario" />
        <img
          src="/svg/header/agregarheadernegro.svg"
          alt="Crear Usuario"
          className="create-hover-usuarios"
        />
        Crear Usuario
      </button>
      {/* Modal */}
      <div
        id="slide-down-animated-modal"
        className={`overlay modal fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-opacity duration-300 ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none hidden"
        }`}
        role="dialog"
        tabIndex={-1}
        aria-hidden={!isModalOpen}
      >
        <div className="modal-dialog modal-dialog-lg w-full max-w-3xl rounded-lg shadow-lg transform transition-transform duration-300 ease-out">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-center p-4 border-gray-700">
              <h3 className="modal-title text-black">Crear Usuario</h3>
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm"
                aria-label="Close"
                onClick={toggleModal}
              >
                <img src="/svg/modals/close.svg" alt="Close" />
              </button>
            </div>

            <div className="modal-body p-4">
              <form
                className="w-full h-full flex flex-row gap-2 flex-wrap justify-center mb-4 mt-2"
                onSubmit={handleSubmit}
              >
                <div className="div-inputs-form">
                  <img src="/svg/modals/nombre.svg" alt="Nombre" />
                  <Input
                    className="inputs-form-crear-usuario"
                    placeholder="Nombre y Apellido"
                    required
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="div-inputs-form">
                  <img src="/svg/modals/tel.svg" alt="Teléfono" />
                  <Input
                    className="inputs-form-crear-usuario"
                    placeholder="Teléfono"
                    required
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="div-inputs-form">
                  <img src="/svg/modals/email.svg" alt="Email" />
                  <Input
                    className="inputs-form-crear-usuario"
                    type="email"
                    placeholder="Correo electrónico"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="div-inputs-form">
                  <img src="/svg/modals/user.svg" alt="Usuario" />
                  <Input
                    className="inputs-form-crear-usuario"
                    placeholder="Usuario"
                    required
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                  />
                </div>

                <div className="div-inputs-form">
                  <img src="/svg/modals/ubicacion.svg" alt="Ciudad" />
                  <Input
                    className="inputs-form-crear-usuario"
                    placeholder="Ciudad"
                    required
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                  />
                </div>

                <div className="div-inputs-form">
                  <img src="/svg/modals/rol.svg" alt="Rol" />
                  <select
                    className="inputs-form-crear-usuario border-0 bg-transparent text-gray-700 w-full"
                    required
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Rol
                    </option>
                    <option value="ADMIN">Administrador</option>
                    <option value="BASIC">Cliente</option>
                  </select>
                </div>

                <div className="div-inputs-form">
                  <img src="/svg/modals/contraseña.svg" alt="Contraseña" />
                  <Input
                    className="inputs-form-crear-usuario"
                    type="password"
                    placeholder="Contraseña"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="div-inputs-form">
                  <img
                    src="/svg/modals/contraseña.svg"
                    alt="Confirmar contraseña"
                  />
                  <Input
                    className="inputs-form-crear-usuario"
                    type="password"
                    placeholder="Confirmar contraseña"
                    required
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full modal-footer flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="button-close-modal"
                    onClick={toggleModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="button-send-modal">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crearusuario;
