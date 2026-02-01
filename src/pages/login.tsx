import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/lib/store/hooks';
import { setLogin } from '@/lib/store/authSlice';
import { Input } from '@/components/UI/Inputs/input';
import EyeIcon from '@/components/UI/svg/EyeIcon';
import CheckboxWithLabel from '@/components/UI/Checkbox/CheckboxWithLabel';
import Button from '@/components/UI/Button/button';
import { handleLogin } from '@/lib/services/authService';
import type { LoginFormData } from '@/lib/services/authService';
import '@/css/login.css';
import '@/css/Link.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const parsed = JSON.parse(savedUserData);
        if (parsed.username && parsed.password) {
          setFormData({
            email: parsed.username,
            password: parsed.password,
          });
          setCheck(true);
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const changeCheck = (e: ChangeEvent<HTMLInputElement>): void => {
    setCheck(e.target.checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await handleLogin(formData);
      if (!response) {
        return;
      }

      // Guardar usuario y perfil en Redux
      dispatch(setLogin({
        user: response.user,
        profile: response.user?.profile || null,
        token: response.accesToken
      }));

      // Guardar credenciales si el usuario lo eligió
      if (check) {
        localStorage.setItem(
          'userData',
          JSON.stringify({
            username: formData.email,
            password: formData.password,
          })
        );
      } else {
        localStorage.removeItem('userData');
      }

      // Redirigir según el estado del usuario
      if (response.user.blockedbypay === true) {
        navigate('/pagos');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fondo-login">
      <div className="div-form-login">
        {/* Header */}
        <div className="header-form-login">
          <div className="logo-login">
            <img
              src="./images/Logos/Logo-Auth.png"
              className="logo-img-login"
              alt="Logo Concursemos"
            />
          </div>
          <div className="div-header-text">
            <h3 className="h3-class-login">Ingresa Ahora</h3>
            <p className="descripcion-login">
              Hola, ingresa tus datos para iniciar sesión en tu cuenta
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="div-contenido-login">
          <form className="form-login" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              disabled={isLoading}
            />

            <div className="div-input">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input2"
                noFocusRing
                disabled={isLoading}
              />
              <EyeIcon onClick={() => setShowPassword((prev) => !prev)} className="svg-login" />
            </div>

            <div className="div-link-reset-login">
              <CheckboxWithLabel
                id="remember-me"
                name="rememberMe"
                label="Recordar datos de usuario"
                checked={check}
                onChange={changeCheck}
              />

              <Link to="/enviar-restablecimiento" className="link-register-login">
                ¿Olvidó su contraseña?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar Ahora'}
            </Button>

            <div className="div-register-link">
              <p className="label-register-link">¿No tienes cuenta?</p>
              <Link to="/registro" className="register-link">
                Regístrate Ahora
              </Link>
            </div>
          </form>
        </div>
      </div>

      <p className="copyraight">© Copyright concursemos 2025</p>
    </div>
  );
};

export default Login;