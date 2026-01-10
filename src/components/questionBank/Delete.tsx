import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Question } from "@/lib/types/questionBank";

interface DeleteProps {
  question: Question;
  token: string;
}

export const Delete: React.FC<DeleteProps> = ({ question, token }) => {
  const navigate = useNavigate();

  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const confirmBlock = () => {
    Swal.fire({
      title: "¿Estás Seguro?",
      text: `¿Deseas eliminar una pregunta?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `eliminar`,
    }).then((result) => {
      if (result.isConfirmed) {
        blockUser();
      }
    });
  };

  const blockUser = async (): Promise<void> => {
    const headers = {
      cnrsms_token: token,
    };

    try {
      // Realizamos la solicitud para eliminar la pregunta
      await axios.delete(`questions/${question.id}`, { headers });

      // Mostrar el mensaje de éxito
      Swal.fire({
        title: "Operación Exitosa",
        text: `Se ha eliminado la pregunta`,
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: `Ok`,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(); // Pasamos el nuevo valor a la función de bloqueo
        }
      });
    } catch (error: any) {
      if (error?.response?.data?.message === "Token expirado") {
        Swal.fire({
          title: "Inicio de sesión expirado",
          text: `Vuelve a ingresar a la plataforma`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        logout();
        return;
      }

      Swal.fire({
        title: "Error",
        text: `Estamos teniendo fallas técnicas`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="22"
        viewBox="0 0 13 16"
        fill="none"
        style={{ cursor: "pointer" }}
        onClick={confirmBlock}
      >
        <path
          d="M12.7552 1.84615H9.11089V0.923077C9.11089 0.414154 8.70211 0 8.1998 0H4.55544C4.05313 0 3.64436 0.414154 3.64436 0.923077V1.84615H0V2.46154H0.909874L2.14835 16H10.6069L11.8454 2.46154H12.7552V1.84615ZM4.25175 0.923077C4.25175 0.753846 4.38841 0.615385 4.55544 0.615385H8.1998C8.36683 0.615385 8.5035 0.753846 8.5035 0.923077V1.84615H4.25175V0.923077ZM10.0536 15.3846H2.70168L1.5197 2.46154H11.2355L10.0536 15.3846Z"
          fill={question.isReported ? "#fff" : "#FF914C"}
        />
        <path
          d="M6.07373 4.30774H6.68112V13.5385H6.07373V4.30774Z"
          fill={question.isReported ? "#fff" : "#FF914C"}
        />
        <path
          d="M4.25195 4.30774H4.85935V13.5385H4.25195V4.30774Z"
          fill={question.isReported ? "#fff" : "#FF914C"}
        />
        <path
          d="M7.896 4.30774H8.50339V13.5385H7.896V4.30774Z"
          fill={question.isReported ? "#fff" : "#FF914C"}
        />
      </svg>
    </>
  );
};

export default Delete;
