import Swal from 'sweetalert2';


export const showAlert = (
  title: string, 
  text: string, 
  type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
) => {
  return Swal.fire({
    title,
    text,
    icon: type,
    confirmButtonText: 'Ok',
  });
};


export const showConfirm = (
  title: string, 
  text: string, 
  confirmText: string, 
  onConfirm: () => void
): void => {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};