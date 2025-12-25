import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Input } from '@/components/UI/Inputs/input'; 
import './css/styles.css'

interface FormData {
  nickname: string;
  telefono: string;
  email: string;
  city: string;
  cc: string;
  genero: string;
  photo: File | string;
}

interface AuthResponse {
  accesToken: string;
  user: {
    id: string;
    email: string;
    lastName: string;
    profile: {
      id: string;
      nickname: string;
      City: string;
      CC: string;
      Gender: string;
      photoUrl?: string;
    };
  };
}

export const EditarPerfil: React.FC = () => {
  const [disable, setDisable] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    telefono: '',
    email: '',
    city: '',
    cc: '',
    genero: '',
    photo: '',
  });

  // Estado para la imagen
  const [image, setImage] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [userID, setUserID] = useState<string>('');
  const [profileID, setProfileID] = useState<string>('');

  const logout = (): void => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  // Función para manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setDisable(false);
  };

  // Función para manejar el cambio en los campos de Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: 'Advertencia',
          text: 'Formato de archivo no válido',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    
    setDisable(false);
  };

  // Cargar datos iniciales desde localStorage
  useEffect(() => {
    const authResponseStr = localStorage.getItem('authResponse');
    if (authResponseStr) {
      const authResponse: AuthResponse = JSON.parse(authResponseStr);
      setToken(authResponse.accesToken);
      setUserID(authResponse.user.id);
      setProfileID(authResponse.user.profile.id);
      
      if (authResponse.user.profile.photoUrl) {
        setPhotoUrl(authResponse.user.profile.photoUrl);
      }

      setFormData({
        nickname: authResponse.user.profile.nickname || '',
        telefono: authResponse.user.lastName || '',
        email: authResponse.user.email || '',
        city: authResponse.user.profile.City || '',
        cc: authResponse.user.profile.CC || '',
        genero: authResponse.user.profile.Gender || '',
        photo: '',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Aquí iría la lógica de envío cuando tengas el backend
    console.log('Formulario enviado:', formData);
    
    // Ejemplo de mensaje de éxito (remover cuando integres el backend)
    Swal.fire({
      title: 'Perfil actualizado',
      text: 'Los cambios se han guardado correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    
    setDisable(true);
  };

  return (
    <form className='form-editar-perfil' onSubmit={handleSubmit}>
      <div>
          <img 
            src={image || photoUrl || '/images/Logos/Logo-login.png'} 
            alt="Perfil" 
            className='imagen-perfil' 
          />
          <label htmlFor="file">
            <img src="/svg/perfil/foto.svg" alt="Cambiar foto" />
          </label>
          <input 
            type="file" 
            id='file' 
            accept="image/*" 
            name='photo' 
            onChange={handleChange} 
            className='hidden' 
          />

        
          <div>
            <Input
              type="text"
              placeholder="Usuario"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              width="100%"
              height="40px"
            />
            <Input
              type="text"
              placeholder="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              width="100%"
              height="40px"
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Correo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              width="100%"
              height="40px"
            />
            <Input
              type="text"
              placeholder="Ciudad"
              name="city"
              value={formData.city}
              onChange={handleChange}
              width="100%"
              height="40px"
            />
          </div>
          
          <div>
            <Input
              type="number"
              placeholder="Cédula (Opcional)"
              name="cc"
              value={formData.cc}
              onChange={handleChange}
              width="100%"
              height="40px"
            />
            <Input
              type="text"
              placeholder="Género (Opcional)"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              width="100%"
              height="40px"
            />
          </div>
      </div>
      
      <button 
        type="submit" 
        disabled={disable} 
      >
        Actualizar Perfil
      </button>
    </form>
  );
};

export default EditarPerfil;