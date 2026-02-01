import { createPortal } from "react-dom";
import type { QuestionCategory } from "@/lib/api/Questions";
import { useEditarPreguntaLogic } from "@/lib/services/Categoty/useEditarPreguntaLogic";
import "@/components/modals/css/styles.css";
import "@/components/Category/css/styles.css";

interface EditarPreguntaProps {
  pregunta: QuestionCategory;
  token: string;
  onSuccess?: () => void;
}

const EditarPregunta: React.FC<EditarPreguntaProps> = ({
  pregunta,
  token,
  onSuccess,
}) => {
  const {
    isOpen,
    setIsOpen,
    isLoading,
    formData,
    nameFile,
    handleChange,
    handleSubmit,
  } = useEditarPreguntaLogic({ pregunta, token, onSuccess });

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
              <div
                className="modal-content"
                style={{ backgroundColor: "#1F2336" }}
              >
                <div className="modal-header flex justify-between items-center p-4 border-gray-700">
                  <h3
                    className="modal-title text-white"
                    style={{ color: "#FFF" }}
                  >
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
                    <label
                      htmlFor={`imagen2-${pregunta.id}`}
                      className="inputs-categorias flex cursor-pointer"
                    >
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
          document.body,
        )}
    </>
  );
};

export default EditarPregunta;
