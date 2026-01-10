import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
// import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "@/components/modals/css/styles.css"; 
import "@/components/Category/css/styles.css"; 

// Definir tipos
interface Category {
  id: string;
  category: string;
  photo_category: string;
}

interface UserProfile {
  id: string;
  // agregar otros campos según necesites
}

interface EditarPreguntaProps {
  pregunta: Category;
  token: string;
  profile: UserProfile | null;
}

interface FormData {
  nombre: string;
  imagen2: File | string;
}

const EditarPregunta: React.FC<EditarPreguntaProps> = ({
  pregunta,
  token,
  profile,
}) => {
  const navigate = useNavigate();

  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  // Estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    nombre: pregunta.category,
    imagen2: pregunta.photo_category,
  });

  const [nameFile, setNameFile] = useState<string>(
    pregunta.photo_category.replace(
      "http://api.backconcursemos.com/upload/questions_category/",
      ""
    )
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Función para manejar el cambio en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, files, value, type } = e.target;

    if (type === "file" && files && files.length > 0) {
      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(files[0].type)) {
        Swal.fire({
          title: "Advertencia",
          text: "Formato de archivo no válido",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        e.target.value = "";
        return;
      }

      // Manejar el archivo seleccionado
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Guardamos el archivo en el estado
      }));
      setNameFile(files[0].name);
    } else {
      // Manejar otros campos
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (formData.nombre === "" || formData.imagen2 === "") {
      Swal.fire({
        title: "Error",
        text: "Por favor adjunta una imagen",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      cnrsms_token: token,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("category", formData.nombre);

    if (
      formData.imagen2 !== pregunta.photo_category &&
      formData.imagen2 instanceof File
    ) {
      formDataToSend.append("file", formData.imagen2);
    }

    try {
      // Descomenta cuando tengas el backend
      // const response = await axios.put(
      //   `questions-category/edit/${pregunta.id}`,
      //   formDataToSend,
      //   { headers }
      // );

      // Simulación de éxito para desarrollo
      Swal.fire({
        title: "Operación Exitosa",
        text: `Categoría ${formData.nombre} modificada con éxito`,
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          // Cerrar el modal
          setIsOpen(false);

          // Recargar la página
          window.location.reload();
        }
      });
    } catch (error: any) {
      console.error("Error:", error);

      if (
        error?.response?.data?.message?.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        Swal.fire({
          title: "Error",
          text: "Esta categoría ya está registrada",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      if (error?.response?.data?.message === "Token expirado") {
        Swal.fire({
          title: "Token expirado",
          text: "Vuelve a ingresar a la plataforma",
          icon: "error",
          confirmButtonText: "Ok",
        });
        logout();
        return;
      }

      Swal.fire({
        title: "Error",
        text: "Estamos teniendo fallas técnicas",
        icon: "error",
        confirmButtonText: "Ok",
      });
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

     {isOpen && createPortal(
  <div
    id={pregunta.id}
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
      {/* SOLO QUITA EL style={{height: '90%'}} */}
      <div className="modal-content" style={{backgroundColor: '#1F2336'}}>
        <div className="modal-header flex justify-between items-center p-4 border-gray-700">
          <h3 className="modal-title text-white" style={{color: '#FFF'}}>Editar Categoria</h3>
          <button
            type="button"
            className="btn btn-text btn-circle btn-sm"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          >
            <img src="/svg/modals/close.svg" alt="Close" />
          </button>
        </div>

        <div className="modal-body p-4">
          <form className="w-full h-full flex flex-row gap-2 flex-wrap justify-start mb-4 mt-2" onSubmit={handleSubmit}>
            <h6 className='titulos-azules'>Nombre de la categoría</h6>
            <input 
              className="inputs-categorias" 
              type="text" 
              placeholder="Nombre de Categoría" 
              required 
              name='nombre' 
              value={formData.nombre} 
              onChange={handleChange}
            />

            <h6 className='titulos-azules'>Imagen destacada</h6>
            <label htmlFor={`imagen2-${pregunta.id}`} className='inputs-categorias flex'>
              <p>{formData.imagen2 ? nameFile : 'Selecciona una imagen destacada, de máximo 1mb y con las medidas de 400x200'}</p>
              <img src="/svg/modals/file.svg" alt="" className=''/>
            </label>
            <input 
              className="inputs-categorias hidden" 
              id={`imagen2-${pregunta.id}`} 
              type="file" 
              placeholder="Selecciona una imagen destacada, de máximo 1mb y con las medidas de 400x200" 
              accept="image/*" 
              name='imagen2' 
              onChange={handleChange}
            />
                    
            <div className="w-full modal-footer">
              <button 
                type="button" 
                className="button-close-modal" 
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="button-send-modal">Guardar Cambios</button>
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