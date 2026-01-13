import React from 'react';
import { unapproveQuestion } from '@/lib/api/Questions';
import { showConfirm, showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';

interface Question {
  id: string | number;
  text?: string;
  [key: string]: any;
}

interface UnaprovedProps {
  question: Question;
  setUpdate: () => void;
  token: string;
}

export const Unaproved: React.FC<UnaprovedProps> = ({ question, setUpdate, token }) => {
  const { logout } = useLogout();

  const confirmBlock = async () => {
    showConfirm(
      '¿Estás Seguro?',
      '¿Deseas desaprobar una pregunta?',
      'Desaprobar',
      async () => {
        try {
          await unapproveQuestion(question.id, token);
          
          showAlert(
            'Operación Exitosa',
            'Se ha desaprobado la pregunta',
            'success'
          ).then(() => {
            setUpdate();
          });
          
        } catch (error: any) {
          if (error?.response?.data?.message === 'Token expirado') {
            showAlert(
              'Inicio de sesión expirado',
              'Vuelve a ingresar a la plataforma',
              'error'
            ).then(() => {
              logout();
            });
            return;
          }
          
          showAlert('Error', 'Estamos teniendo fallas técnicas', 'error');
        }
      }
    );
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 18 18" 
      fill="none" 
      style={{cursor: "pointer"}} 
      onClick={confirmBlock}
    >
      <path d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill="#3CEBFF"/>
      <path d="M14.5131 7.15439C15.0052 6.66235 15.0052 5.86451 14.5131 5.37247C14.021 4.8804 13.2232 4.8804 12.7311 5.37247L7.56398 10.5396L5.30478 8.2804C4.81271 7.78835 4.01492 7.78835 3.52285 8.28042C3.03081 8.77246 3.03078 9.57033 3.52283 10.0623C3.52329 10.0628 3.52383 10.0632 3.52429 10.0637L6.97402 13.5163C7.29907 13.8414 7.82609 13.8414 8.15112 13.5163L14.5116 7.15578C14.5121 7.15529 14.5126 7.15483 14.5131 7.15439Z" fill="white"/>
    </svg>
  );
};

export default Unaproved;