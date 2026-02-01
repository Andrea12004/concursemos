
import "./css/styles.css";
import "@/components/UI/Button/styles.css";
import React from 'react';
import { Input } from '@/components/UI/Inputs/input';

import { useCrearusuarioLogic } from '@/lib/services/modals/useCreateusers';

interface CrearUsuarioProps {
  onUserCreated?: () => void; // Callback para refrescar lista
}

const Crearusuario: React.FC<CrearUsuarioProps> = ({ onUserCreated }) => {
  const {
    isModalOpen,
    formData,
    toggleModal,
    handleChange,
    handleSubmit
  } = useCrearusuarioLogic({ onUserCreated });

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
                    noFocusRing
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
                    noFocusRing
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
                    noFocusRing
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
                    noFocusRing
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
                    noFocusRing
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
                    noFocusRing
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
                    noFocusRing
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
