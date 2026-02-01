import React from "react";
import { createPortal } from "react-dom";
import { Input } from '@/components/UI/Inputs/input';
import { useEditarPreguntaLogic } from '@/lib/services/modals/useEditQuestion';
import type { Question as QuestionType } from "@/lib/types/questionBank"; 

interface EditarPreguntaProps {
  pregunta: QuestionType;
  token: string;
}

const EditarPregunta: React.FC<EditarPreguntaProps> = ({ pregunta, token }) => {
  const {
    isOpen,
    setIsOpen,
    categories,
    formData,
    handleChange,
    handleSubmit
  } = useEditarPreguntaLogic({ pregunta, token });


  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="group inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg border border-white/30 bg-transparent text-white text-xs sm:text-sm font-semibold hover:bg-[#f26a2f] hover:border-[#f26a2f] hover:shadow-lg hover:shadow-[#f26a2f]/30 hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
        onClick={() => setIsOpen(true)}
      >
        <span className="hidden sm:inline">Editar</span>
        <img
          src="/svg/banco/editar.svg"
          alt="Editar"
          className="w-4 h-4 nohover-banco"
        />
        <img
          src="/svg/banco/editar-hover.svg"
          alt="Editar hover"
          className="w-4 h-4 hover-banco"
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex justify-center items-center"
            role="dialog"
            aria-modal="true"
            style={{
              backgroundColor: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div className="w-full max-w-3xl rounded-lg shadow-lg bg-[#1F2336] max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-white text-2xl font-semibold">
                  Editar Pregunta
                </h3>
                <button
                  type="button"
                  className="btn btn-text btn-circle btn-sm"
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                >
                  <img src="/svg/modals/close.svg" alt="Close" />
                </button>
              </div>

              <div className="p-4">
                <form
                  className="w-full flex flex-col gap-4"
                  onSubmit={handleSubmit}
                >
                  <h6 className="titulos-azules">¿Cuál será la pregunta?</h6>

                  <textarea
                    className="inputs-categorias p-2"
                    style={{ height: "10%", margin: "0%" }}
                    value={formData.Preguntaedit}
                    required
                    name="Preguntaedit"
                    onChange={handleChange}
                  />

                  <h6 className="titulos-azules">
                    ¿A qué categoría pertenece la pregunta?
                  </h6>

                  <div className="radio-button-container w-full">
                    {categories.length > 0
                      ? categories.map((item) => (
                          <div className="radio-button" key={item.id}>
                            <input
                              type="radio"
                              id={`${pregunta.id}${item.id}`}
                              className="radio-button__input"
                              checked={formData.Categoriaedit === item.id}
                              name="Categoriaedit"
                              value={item.id}
                              onChange={handleChange}
                            />
                            <label
                              className="radio-button__label"
                              htmlFor={`${pregunta.id}${item.id}`}
                            >
                              <span className="radio-button__custom"></span>
                              {item.category}
                            </label>
                          </div>
                        ))
                      : "Cargando..."}
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
                        placeholder="Escribe tu respuesta #1"
                        name="Respuesta1edit"
                        value={formData.Respuesta1edit}
                        onChange={handleChange}
                      />
                      <div className="radio-button">
                        <input
                          type="radio"
                          id={`radioo1${pregunta.id}`}
                          className="radio-button__input"
                          checked={
                            formData.CorrectAnsweredit === "Respuesta1edit"
                          }
                          name="CorrectAnsweredit"
                          value="Respuesta1edit"
                          onChange={handleChange}
                        />
                        <label
                          className="radio-button__label"
                          htmlFor={`radioo1${pregunta.id}`}
                        >
                          <span className="radio-button__custom"></span>
                          Respuesta correcta
                        </label>
                      </div>
                    </div>

                    <p className="titulos-azules" style={{ fontSize: "20px" }}>
                      Respuesta 2
                    </p>

                    <div>
                      <Input
                        placeholder="Escribe tu respuesta #2"
                        name="Respuesta2edit"
                        value={formData.Respuesta2edit}
                        onChange={handleChange}
                      />
                      <div className="radio-button">
                        <input
                          type="radio"
                          id={`radioo2${pregunta.id}`}
                          className="radio-button__input"
                          checked={
                            formData.CorrectAnsweredit === "Respuesta2edit"
                          }
                          name="CorrectAnsweredit"
                          value="Respuesta2edit"
                          onChange={handleChange}
                        />
                        <label
                          className="radio-button__label"
                          htmlFor={`radioo2${pregunta.id}`}
                        >
                          <span className="radio-button__custom"></span>
                          Respuesta correcta
                        </label>
                      </div>
                    </div>

                    <p className="titulos-azules" style={{ fontSize: "20px" }}>
                      Respuesta 3
                    </p>

                    <div>
                      <Input
                        placeholder="Escribe tu respuesta #3"
                        name="Respuesta3edit"
                        value={formData.Respuesta3edit}
                        onChange={handleChange}
                      />
                      <div className="radio-button">
                        <input
                          type="radio"
                          id={`radioo3${pregunta.id}`}
                          className="radio-button__input"
                          checked={
                            formData.CorrectAnsweredit === "Respuesta3edit"
                          }
                          name="CorrectAnsweredit"
                          value="Respuesta3edit"
                          onChange={handleChange}
                        />
                        <label
                          className="radio-button__label"
                          htmlFor={`radioo3${pregunta.id}`}
                        >
                          <span className="radio-button__custom"></span>
                          Respuesta correcta
                        </label>
                      </div>
                    </div>

                    <p className="titulos-azules" style={{ fontSize: "20px" }}>
                      Respuesta 4
                    </p>

                    <div>
                      <Input
                        placeholder="Escribe tu respuesta #4"
                        name="Respuesta4edit"
                        value={formData.Respuesta4edit}
                        onChange={handleChange}
                      />
                      <div className="radio-button">
                        <input
                          type="radio"
                          id={`radioo4${pregunta.id}`}
                          className="radio-button__input"
                          checked={
                            formData.CorrectAnsweredit === "Respuesta4edit"
                          }
                          name="CorrectAnsweredit"
                          value="Respuesta4edit"
                          onChange={handleChange}
                        />
                        <label
                          className="radio-button__label"
                          htmlFor={`radioo4${pregunta.id}`}
                        >
                          <span className="radio-button__custom"></span>
                          Respuesta correcta
                        </label>
                      </div>
                    </div>

                    <div
                      className="w-full h-full gap-2 flex"
                      style={{
                        height: "10%",
                        margin: "0%",
                        background: "transparent",
                      }}
                    >
                      <button
                        type="button"
                        className="button-close-modal"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="button-send-modal">
                        Actualizar Pregunta
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default EditarPregunta;