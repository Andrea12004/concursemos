import React, { useState} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import { Input } from '@/components/UI/Inputs/input';
import EyeIcon from "@/components/UI/svg/EyeIcon";
import '@/css/login.css'; 
import '@/css/Link.css';
import CheckboxWithLabel from '@/components/UI/Checkbox/CheckboxWithLabel';
import Button from '@/components/UI/Button/button';
import { users } from '@/lib/fakeAuth';
import { useAuth } from '@/lib/auth';

interface FormData {
  email: string;
  password: string;
}

interface LoginProps {

}

const Login: React.FC<LoginProps> = () => {

  //SIMULACIÓN 

const navigate = useNavigate(); // 👈 IMPORTANTE

  const FAKE_EMAIL = "soporte@togrowagencia.com";
  const FAKE_PASSWORD = "togrow2024!";

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const auth = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email == '' || formData.password == '') {
      Swal.fire({
        title: 'Error',
        text: `Por favor llena todos los campos`,
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Validar contra usuarios simulados
    const matched = users.find(u => u.email === formData.email && u.password === formData.password);
    if (matched) {
      try { auth.login(matched.email, matched.role); } catch (e) {}
      navigate('/dashboard');
      return;
    }

    // Si falla
    Swal.fire({
      title: 'Credenciales incorrectas',
      text: 'Verifica tu correo y contraseña',
      icon: 'error',
      confirmButtonText: 'Intentar nuevamente'
    });

    console.log('Formulario enviado:', formData);
  };

  const togglePassword = () => {
    setShowPassword(prevState => !prevState);
  };


  return (
    <>
      <div className='fondo-login'>
        <div className='div-form-login'>
          {/*encabezado*/}
          <div className='header-form-login'>
            <div className='logo-login'>
              <img 
                src="./images/Logos/Logo-Auth.png" 
                className='logo-img-login' 
                alt="Logo Concursemos"
              />
            </div>
            <div className='div-header-text'>
              <h3 className='h3-class-login'>Ingresa Ahora</h3>
              <p className='descripcion-login'>
                Hola, ingresa tus datos para iniciar sesión en tu cuenta
              </p>
            </div>
          </div>
          {/*end::encabezado*/}

          {/*contenido form*/}
          <div className='div-contenido-login'>
            <form className='form-login' onSubmit={handleSubmit}>
              <Input
                  type="email"
                  placeholder="Ingresa tu correo"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />

              <div className='div-input'>
                <Input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input2"
                    showPassword={showPassword} 
                    noFocusRing={true}
                  />
                <EyeIcon onClick={togglePassword} className="svg-login" />
              </div>

              <div className='div-link-reset-login'>
                <CheckboxWithLabel
                    id="cbtest-19"
                    name="rememberme"
                    label="Recordar datos de usuario"
                    checked={check}
                    onChange={(e) => setCheck(e.target.checked)}
                  />

                <Link to="/enviar-restablecimiento" className='link-register-login'>
                  ¿Olvidó su contraseña?
                </Link>
              </div>

              <Button type="submit"> Ingresar Ahora</Button>

              

              
              <div className='div-register-link'>
                <p className='label-register-link'>¿No tienes cuenta?</p>
                <Link to="/registro" className='register-link'>
                  Regístrate Ahora
                </Link>
              </div>
            </form>
          </div>
          {/*end::contenido form*/}
        </div>
        <p className='copyraight'>©Copyright concursemos 2025</p>
      </div>
    </>
  );
};

export default Login;