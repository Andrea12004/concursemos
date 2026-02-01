import React from 'react';
import { Input } from '@/components/UI/Inputs/input';
import { useCrearCategoriaLogic } from '@/lib/services/modals/useModalCategory';
import "./css/Category.css";

interface CrearCategoriaProps {
  onReload?: () => void; 
}

const CrearCategoria: React.FC<CrearCategoriaProps> = ({ onReload }) => {
  const {
    show,
    loading,
    nameFile,
    formData,
    closeModal,
    openModal,
    handleChange,
    handleSubmit
  } = useCrearCategoriaLogic({ onReload });
  return (
    <>
      <button
        type="button"
        className="px-4 py-2 bg-[#3cebff] textos font-bold rounded-lg hover:scale-105 transition-transform"
        aria-haspopup="dialog"
        aria-expanded={show}
        aria-controls="category-modal"
        onClick={openModal}
      >
        Crear Categoría
      </button>

      {show && (
        <div
          id="category-modal"
          className="overlay modal fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          role="dialog"
          tabIndex={-1}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modal-dialog modal-dialog-xl w-full max-w-3xl rounded-lg shadow-lg">
            <div
              className="modal-content"
              style={{ backgroundColor: "#1F2336" }}
            >
              <div className="modal-header flex justify-between items-center p-4 border-gray-700">
                <h3 className="modal-title" style={{ color: "#FFF" }}>
                  Crear Categoría
                </h3>
                <button
                  type="button"
                  className="btn btn-text btn-circle btn-sm"
                  aria-label="Close"
                  onClick={closeModal}
                  disabled={loading}
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
                  <Input
                    className="inputs-categorias"
                    placeholder="Nombre de Categoría"
                    required
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <h6 className="titulos-azules">Imagen destacada</h6>
                  <label 
                    htmlFor="imagen" 
                    className={`inputs-categorias flex ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <p>
                      {formData.imagen
                        ? nameFile
                        : "Selecciona una imagen destacada, de máximo 1mb y con las medidas de 400x200"}
                    </p>
                    <img src="/svg/modals/file.svg" alt="" className="" />
                  </label>
                  <input
                    className="inputs-categorias hidden"
                    id="imagen"
                    type="file"
                    placeholder="Selecciona una imagen destacada"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <div className="w-full modal-footer flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      className="button-close-modal"
                      aria-label="Close"
                      onClick={closeModal}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="button-send-modal flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creando...
                        </>
                      ) : (
                        'Crear Categoría'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrearCategoria;