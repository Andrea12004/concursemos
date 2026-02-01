import React from 'react';
import { deleteQuestion } from '@/lib/api/Questions';
import { showConfirm, showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';

interface Question {
  id: string | number;
  text?: string;
  isReported?: boolean;
  [key: string]: any;
}

interface DeleteProps {
  question: Question;
  token: string;
  onDeleteSuccess?: () => void;
}

export const Delete: React.FC<DeleteProps> = ({ question, token, onDeleteSuccess }) => {
  const { logout } = useLogout();

  const confirmBlock = async () => {
    showConfirm(
      '¿Estás Seguro?',
      '¿Deseas eliminar una pregunta?',
      'Eliminar',
      async () => {
        try {
          await deleteQuestion(question.id.toString(), token);
          
          showAlert(
            'Operación Exitosa',
            'Se ha eliminado la pregunta',
            'success'
          ).then(() => {
            if (onDeleteSuccess) {
              onDeleteSuccess();
            } else {
              window.location.reload();
            }
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
      width="25" 
      height="22" 
      viewBox="0 0 13 16" 
      fill="none" 
      style={{cursor: "pointer"}} 
      onClick={confirmBlock}
    >
      <path d="M12.7552 1.84615H9.11089V0.923077C9.11089 0.414154 8.70211 0 8.1998 0H4.55544C4.05313 0 3.64436 0.414154 3.64436 0.923077V1.84615H0V2.46154H0.909874L2.14835 16H10.6069L11.8454 2.46154H12.7552V1.84615ZM4.25175 0.923077C4.25175 0.753846 4.38841 0.615385 4.55544 0.615385H8.1998C8.36683 0.615385 8.5035 0.753846 8.5035 0.923077V1.84615H4.25175V0.923077ZM10.0536 15.3846H2.70168L1.5197 2.46154H11.2355L10.0536 15.3846Z" fill={question.isReported ? '#fff' : "#FF914C"}/>
      <path d="M6.07373 4.30774H6.68112V13.5385H6.07373V4.30774Z" fill={question.isReported ? '#fff' : "#FF914C"}/>
      <path d="M4.25195 4.30774H4.85935V13.5385H4.25195V4.30774Z" fill={question.isReported ? '#fff' : "#FF914C"}/>
      <path d="M7.896 4.30774H8.50339V13.5385H7.896V4.30774Z" fill={question.isReported ? '#fff' : "#FF914C"}/>
    </svg>
  );
};

export default Delete;