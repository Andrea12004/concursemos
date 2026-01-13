import React from 'react';
import { approveQuestionEndpoint } from '@/lib/api/Questions';
import { showConfirm, showAlert } from '@/lib/utils/showAlert';
import { useLogout } from '@/lib/hooks/useLogout';

interface Question {
  id: string | number;
  text?: string;
  [key: string]: any;
}

interface AprovedProps {
  question: Question;
  setUpdate: () => void;
  token: string;
}

export const Aproved: React.FC<AprovedProps> = ({ question, setUpdate, token }) => {
  const { logout } = useLogout();

  const confirmBlock = async () => {
    showConfirm(
      '¿Estás Seguro?',
      '¿Deseas aprobar una pregunta?',
      'Aprobar',
      async () => {
        try {
         await approveQuestionEndpoint(question.id.toString(), token);
          
          showAlert(
            'Operación Exitosa',
            'Se ha aprobado la pregunta',
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
      <g clipPath="url(#clip0_730_1323)">
        <path d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill="#FF914C"/>
        <path d="M11.8052 4.41273L8.99983 7.21813L6.19446 4.41278C5.70241 3.92074 4.9046 3.92071 4.41256 4.41278C3.92049 4.90485 3.92047 5.70268 4.41253 6.19473L7.21791 9.00005L4.41251 11.8054C3.92044 12.2975 3.92044 13.0953 4.41251 13.5874C4.90458 14.0795 5.70236 14.0794 6.19443 13.5874V13.5874L8.99983 10.782L11.8045 13.5866C11.8047 13.5869 11.805 13.5871 11.8051 13.5874C12.2972 14.0794 13.095 14.0794 13.5871 13.5873C14.0792 13.0952 14.0792 12.2975 13.5871 11.8054L10.7818 9.00005L13.5864 6.19537C13.5867 6.19511 13.5869 6.19493 13.5872 6.19468C14.0792 5.70261 14.0792 4.90485 13.5872 4.41278C13.0951 3.92068 12.2973 3.92068 11.8052 4.41273Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_730_1323">
          <rect width="18" height="18" fill="#000"/>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Aproved;