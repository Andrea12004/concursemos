import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useResetPasswordService } from "@/lib/services/useReset";
import '@/css/reset.css';
import { EyeIcon, InputStateIcon, PasswordCondition, UserIcon } from "@/components/UI/svg";
import { Input } from '@/components/UI/Inputs/input';

export const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const {
    password,
    password2,
    conditions,
    handleSubmit,
    handlePasswordChange,
    handlePasswordChange2,
  } = useResetPasswordService();

  // Calcula si la primera contraseña es válida
  const isFirstPasswordValid = 
    conditions.lengthValid && 
    conditions.numberValid && 
    conditions.specialValid;

  return (
    <>
      <div className="fondo-reset">
        <div className="div-form-reset">
          <img
            src="/images/Logos/Logo-Auth.png"
            className="logo-img-reset"
            alt="Logo"
          />
          <div className="header-form-reset">
            <div className="div-header-text-reset">
              <h3 className="h3-class-reset">Recupera tu contraseña</h3>
              <p className="descripcion-reset">
                Tu contraseña será enviada a tu correo una vez sea reestablecida
              </p>
            </div>
          </div>

          <div className="div-contenido-reset">
            <form className="form-registro" onSubmit={handleSubmit}>
              <label className="Label-contraseñas" htmlFor="password">
                Contraseña Nueva
              </label>
              <div className="div-input-registro">
                <InputStateIcon 
                  type={isFirstPasswordValid ? "check" : "error"} 
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="input2-reset"
                  placeholder="Ingresa tu contraseña"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  noFocusRing={true}
                />
                <EyeIcon 
                  onClick={() => setShowPassword((prev) => !prev)} 
                  className="svg-login" 
                />
              </div>

              <div className="div-link-reset-register">
                <div>
                  <PasswordCondition
                    valid={conditions.lengthValid}
                    text="8 caracteres"
                  />
                </div>
                <div>
                  <PasswordCondition
                    valid={conditions.numberValid}
                    text="Debe contener mínimo un número"
                  />
                </div>
                <div>
                  <PasswordCondition
                    valid={conditions.specialValid}
                    text="Debe contener mínimo un carácter especial"
                  />
                </div>
              </div>

              <label className="Label-contraseñas" htmlFor="password2">
                Confirma tu contraseña
              </label>
              <div className="div-input-registro">
                <InputStateIcon 
                  type={conditions.coincide ? "check" : "error"} 
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="input2-reset-2"
                  placeholder="Ingresa tu contraseña"
                  name="password2"
                  value={password2}
                  onChange={handlePasswordChange2}
                  noFocusRing={true}
                />
              </div>
              
              <div className="div-link-reset-register">
                <div>
                  <PasswordCondition
                    valid={conditions.coincide}
                    text="Tu contraseña coincide"
                  />
                </div>
              </div>

              <div className="div-link-reset">
                <button type="submit" className="button-ingresar-reset">
                  Cambiar Contraseña
                </button>
                <Link to="/" className="reset-link">
                  <UserIcon />
                   Iniciar Sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
        <p className="copyraight">©Copyright concursemos 2025</p>
      </div>
    </>
  );
};

export default ResetPassword;