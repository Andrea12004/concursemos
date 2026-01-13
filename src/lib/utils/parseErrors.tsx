import { AxiosError } from "axios";
import { showAlert } from "./showAlert";

export const handleAxiosError = (error: unknown, logout?: () => void): void => {
 
   if (!(error instanceof AxiosError)) {
    console.error("Error no axios:", error);
    showAlert('Error', 'Ocurrió un error inesperado', 'error');
    return;
  }

  console.error("Axios Error:", error);
  const data = error.response?.data as any;

  // Token expirado
  if (data?.message === 'Token expirado') {
    showAlert('Inicio de sesión expirado', 'Vuelve a ingresar a la plataforma', 'error')
      .then(() => {
        if (logout) logout();
      });
    return;
  }

  //  Otros errores con mensajes específicos
  let errorMessage = "Estamos teniendo fallas técnicas";
  
  if (data?.message) {
    errorMessage = String(data.message);
  } else if (data?.error) {
    errorMessage = String(data.error);
  } else if (data?.detailMessages) {
    const msgs = Array.isArray(data.detailMessages) 
      ? data.detailMessages 
      : [String(data.detailMessages)];
    errorMessage = msgs.join(', ');
  }

  showAlert('Error', errorMessage, 'error');
};