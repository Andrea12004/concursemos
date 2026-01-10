import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/services/useRegister';
import { 
  validateRegisterForm, 
  validatePassword, 
  type PasswordConditions, 
  type RegisterFormData 
} from '@/lib/Validators/Register';
import { showAlert } from '@/lib/utils/showAlert';

export const useRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [password, setPassword] = useState('');
  const [conditions, setConditions] = useState<PasswordConditions>({
    lengthValid: false,
    numberValid: false,
    specialValid: false,
  });

  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    nickname: '',
    password: '',
  });

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setFormData({
      ...formData,
      password: newPassword,
    });

    // Usar tu validador de contraseña
    const newConditions = validatePassword(newPassword);
    setConditions(newConditions);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const changeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheck(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Usar tu validador de formulario
    if (!validateRegisterForm(formData, conditions, check)) {
      return;
    }
    
    try {
      const userResponse = await authService.registerUser({
        firstName: formData.nombre,
        lastName: formData.telefono,
        email: formData.email,
        password: formData.password,
        role: "BASIC",
        blocked: false,
        authStrategy: "BASIC",
      });
      
      await authService.Profile({
        userId: userResponse.id,
        nickname: formData.nickname,
        City: formData.ciudad,
      });

      showAlert('Operación Exitosa', '', 'success')
        .then(() => {
          navigate('/');
        });
      
    } catch(error: any) {

      showAlert('Estamos teniendo fallas técnicas', 'error');
    }
  };

  return {
    formData,
    password,
    showPassword,
    check,
    conditions,
    togglePassword,
    handlePasswordChange,
    handleChange,
    changeCheck,
    handleSubmit,
    setCheck
  };
};