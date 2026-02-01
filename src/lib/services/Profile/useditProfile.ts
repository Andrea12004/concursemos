import { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setProfile, setUser } from "@/lib/store/authSlice";
import { useLogout } from "@/lib/hooks/useLogout";
import { handleAxiosError } from "@/lib/utils/parseErrors";
import { showAlert } from "@/lib/utils/showAlert";
import { editProfileEndpoint } from "@/lib/api/profile";
import { editUserEndpoint } from "@/lib/api/users";

interface FormData {
  nickname: string;
  telefono: string;
  email: string;
  city: string;
  cc: string;
  genero: string;
  photo: File | string;
}

export const useEditarPerfilLogic = () => {
  const { logout } = useLogout();
  const dispatch = useAppDispatch();
  
  // obtener datos
  const { user, profile } = useAppSelector((state) => state.auth);

  const [disable, setDisable] = useState(true);
  const [token, setToken] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    telefono: '',
    email: '',
    city: '',
    cc: '',
    genero: '',
    photo: '',
  });

  //  Obtener token 
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || '';
    setToken(authToken);
  }, []);

  // Inicializar datos
  useEffect(() => {
    if (user && profile) {
      setPhotoUrl(profile.photoUrl || '');
      
      setFormData({
        nickname: profile.nickname || '',
        telefono: user.lastName || '',
        email: user.email || '',
        city: profile.City || '',
        cc: profile.CC ? String(profile.CC) : '',
        genero: profile.Gender || '',
        photo: '',
      });
    }
  }, [user, profile]);

  // Función para manejar la selección de archivo
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showAlert('Advertencia', 'Formato de archivo no válido', 'warning');
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
        photo: file,
      }));

      setDisable(false);
    }
  }, []);

  // Función para manejar el cambio en los campos
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      handleFileChange(e);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      setDisable(false);
    }
  }, [handleFileChange]);

  //  Actualizar perfil 
  const actPerfil = useCallback(async () => {
    if (!profile?.id) {
      showAlert('Error', 'No se encontró el perfil', 'error');
      return false;
    }

    if (!token) {
      showAlert('Error', 'Token no válido. Vuelve a iniciar sesión', 'error');
      logout();
      return false;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nickname', formData.nickname);
    formDataToSend.append('City', formData.city);
    if (formData.cc) formDataToSend.append('CC', formData.cc);
    if (formData.genero) formDataToSend.append('Gender', formData.genero);
    if (formData.photo && typeof formData.photo !== 'string') {
      formDataToSend.append('file', formData.photo);
    }

    try {
      // Actualizar perfil en el backend
      const updatedProfile = await editProfileEndpoint(profile.id, formDataToSend, token);

      //  SOLO actualizar Redux (sin localStorage)
      const newProfileData = {
        ...profile,
        nickname: formData.nickname,
        City: formData.city,
        CC: formData.cc ? Number(formData.cc) : profile.CC,
        Gender: formData.genero || profile.Gender,
        photoUrl: updatedProfile.photoUrl || profile.photoUrl,
      };
      
      dispatch(setProfile(newProfileData));

      return true;

    } catch (error) {
      handleAxiosError(error, logout);
      return false;
    }
  }, [profile, formData, token, dispatch, logout]);

  // Enviar formulario (optimizado)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showAlert('Error', 'No se encontró el usuario', 'error');
      return;
    }

    if (!token) {
      showAlert('Error', 'Token no válido. Vuelve a iniciar sesión', 'error');
      logout();
      return;
    }

    setLoading(true);

    try {
      // 1. Actualizar datos del usuario (email y teléfono)
      await editUserEndpoint(
        user.id,
        {
          lastName: formData.telefono,
          email: formData.email,
        },
        token
      );

      // 2. Actualizar Redux del usuario
      dispatch(setUser({
        ...user,
        lastName: formData.telefono,
        email: formData.email,
      }));

      // 3. Actualizar el perfil
      const profileUpdated = await actPerfil();

      if (profileUpdated) {
        showAlert(
          'Perfil Actualizado',
          'Tus cambios se guardaron correctamente',
          'success'
        );

        setDisable(true);
        setImage(null);
      }

    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  }, [user, formData, token, dispatch, actPerfil, logout]);

  return {
    disable,
    image,
    photoUrl,
    formData,
    loading,
    handleFileChange,
    handleChange,
    handleSubmit
  };
};