import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";

import "./css/styles.css";

// Definición de tipos
interface FormData {
  nombre: string;
  imagen: File | null;
}

const Crearcategoria: React.FC = () => {
  const [nameFile, setNameFile] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    imagen: null,
  });
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files, value, type } = e.target;

    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Advertencia",
          text: `Formato de archivo no válido`,
          icon: "warning",
          confirmButtonText: "Ok",
        });
        // reset input
        (e.target as HTMLInputElement).value = "";
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
      setNameFile(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.nombre === "" || formData.imagen === null) {
      Swal.fire({
        title: "Error",
        text: `Por favor adjunta una imagen`,
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    try {
      console.log("Datos a enviar:", {
        nombre: formData.nombre,
        imagen: formData.imagen?.name,
      });

      await Swal.fire({
        title: "Operación Exitosa",
        text: `Categoría ${formData.nombre} creada con éxito`,
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: `Ok`,
      });

      // Reset and close
      setFormData({ nombre: "", imagen: null });
      setNameFile("");
      setShow(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: `Estamos teniendo fallas técnicas`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const closeModal = () => setShow(false);

  return (
    <>
      <button
        type="button"
        className="px-4 py-2 bg-[#3cebff] textos font-bold rounded-lg btn-category-small"
        aria-haspopup="dialog"
        aria-expanded={show}
        aria-controls="category-modal"
        onClick={() => setShow(true)}
      >
        Crear Categoría
      </button>

      {show && (
        <div
          id="category-modal20"
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
                  Crear Categoria
                </h3>
                <button
                  type="button"
                  className="btn btn-text btn-circle btn-sm"
                  aria-label="Close"
                  onClick={closeModal}
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
                  />

                  <h6 className="titulos-azules">Imagen destacada</h6>
                  <label htmlFor="imagen" className="inputs-categorias flex">
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
                    placeholder="Selecciona una imagen destacada, de máximo 1mb y con las medidas de 400x200"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChange}
                  />

                  <div className="w-full modal-footer">
                    <button
                      type="button"
                      className="button-close-modal"
                      aria-label="Close"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="button-send-modal">
                      Crear Categoria
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

export default Crearcategoria;
