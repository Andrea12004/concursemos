import { useAppSelector } from "@/lib/store/hooks";
import { Input } from "@/components/UI/Inputs/input";
import RadioOption from "@/components/UI/Inputs/RadioOption";
import CategoriaModal from "@/components/modals/modalCategory-bank";
import { useCrearpreguntaLogic } from "@/lib/services/modals/useCreatequestion";
import "./css/styles.css";

interface CrearPreguntaProps {
  onReload?: () => void;
}

const Crearpregunta: React.FC<CrearPreguntaProps> = ({ onReload }) => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    categories,
    loading,
    formData,
    toggleModal,
    handleChange,
    handleSubmit,
    refreshCategories,
  } = useCrearpreguntaLogic({ onReload });
  return (
    <>
      <button
        type="button"
        className="button-question flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="pregunta"
        onClick={() => toggleModal(true)}
      >
        <img src="/svg/header/agregarheaderblanco.svg" alt="Crear Pregunta" />
        <img
          src="/svg/header/agregarheadernegro.svg"
          alt="Crear Pregunta"
          className="create-hover"
        />
        Crear Pregunta
      </button>

      <div
        id="pregunta"
        className="overlay modal hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog w-full max-w-3xl rounded-lg shadow-lg">
          <div
            className="modal-content modal-content-pregunta"
            style={{ backgroundColor: "#1F2336", height: "90%" }}
          >
            <div className="modal-header flex justify-between items-center p-4 border-gray-700">
              <h3 className="modal-title" style={{ color: "#FFF" }}>
                Crear Pregunta
              </h3>
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm"
                aria-label="Close"
                onClick={() => toggleModal(false)}
              >
                <img src="/svg/modals/close.svg" alt="Close" />
              </button>
            </div>

            <div className="modal-body">
              <div className="flex w-full justify-between mb-4">
                <h6 className="titulos-azules">¿Cuál será la pregunta?</h6>
                {user?.role !== "BASIC" && (
                  <CategoriaModal onReload={refreshCategories} />
                )}
              </div>

              <form
                className="w-full h-[90%] flex flex-column gap-1 flex-wrap items-start"
                onSubmit={handleSubmit}
              >
                <textarea
                  className="inputs-categorias p-2"
                  placeholder="Escribe tu pregunta aquí"
                  name="Pregunta"
                  value={formData.Pregunta}
                  onChange={handleChange}
                  required
                />

                <h6 className="titulos-azules" style={{ margin: "0px" }}>
                  ¿A qué categoría pertenece la pregunta?
                </h6>

                <div className="radio-button-container w-full overflow-x-scroll">
                  {categories.length > 0 ? (
                    categories.map((item) => (
                      <RadioOption
                        key={item.id}
                        id={String(item.id)}
                        name="Categoria"
                        value={String(item.id)}
                        checked={formData.Categoria === String(item.id)}
                        label={item.category}
                        onChange={handleChange}
                      />
                    ))
                  ) : (
                    <p className="text-white">
                      No hay categorías en este momento
                    </p>
                  )}
                </div>

                <div className="div-respuestas w-full">
                  <p
                    className="titulos-azules"
                    style={{ fontSize: "20px", margin: "0px" }}
                  >
                    Respuesta 1
                  </p>
                  <div>
                    <Input
                      type="text"
                      placeholder="Escribe tu respuesta #1"
                      name="Respuesta1"
                      value={formData.Respuesta1}
                      onChange={handleChange}
                

                    />
                    <RadioOption
                      id="radio1"
                      name="CorrectAnswer"
                      value="Respuesta1"
                      checked={formData.CorrectAnswer === "Respuesta1"}
                      label="Respuesta correcta"
                      onChange={handleChange}
                    />
                  </div>

                  <p className="titulos-azules" style={{ fontSize: "20px" }}>
                    Respuesta 2
                  </p>
                  <div>
                    <Input
                      type="text"
                      placeholder="Escribe tu respuesta #2"
                      name="Respuesta2"
                      value={formData.Respuesta2}
                      onChange={handleChange}
                     

                    />
                    <RadioOption
                      id="radio2"
                      name="CorrectAnswer"
                      value="Respuesta2"
                      label="Respuesta correcta"
                      checked={formData.CorrectAnswer === "Respuesta2"}
                      onChange={handleChange}
                    />
                  </div>

                  <p className="titulos-azules" style={{ fontSize: "20px" }}>
                    Respuesta 3
                  </p>
                  <div>
                    <Input
                      type="text"
                      placeholder="Escribe tu respuesta #3"
                      name="Respuesta3"
                      value={formData.Respuesta3}
                      onChange={handleChange}
                      
                    />
                    <RadioOption
                      id="radio3"
                      name="CorrectAnswer"
                      value="Respuesta3"
                      label="Respuesta correcta"
                      checked={formData.CorrectAnswer === "Respuesta3"}
                      onChange={handleChange}
                    />
                  </div>

                  <p className="titulos-azules" style={{ fontSize: "20px" }}>
                    Respuesta 4
                  </p>
                  <div>
                    <Input
                      type="text"
                      placeholder="Escribe tu respuesta #4"
                      name="Respuesta4"
                      value={formData.Respuesta4}
                      onChange={handleChange}
                     
                    />
                    <RadioOption
                      id="radio4"
                      name="CorrectAnswer"
                      value="Respuesta4"
                      label="Respuesta correcta"
                      checked={formData.CorrectAnswer === "Respuesta4"}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      className="button-close-modal"
                      onClick={() => toggleModal(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="button-send-modal"
                      disabled={loading}
                    >
                      {loading ? "Creando..." : "Crear Pregunta"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crearpregunta;
