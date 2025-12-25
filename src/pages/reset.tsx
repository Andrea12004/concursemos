import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '@/css/reset.css';
import { EyeIcon, InputStateIcon, PasswordCondition, UserIcon } from "@/components/UI/svg";
import { Input } from '@/components/UI/Inputs/input';


interface PasswordConditions {
  lengthValid: boolean;
  numberValid: boolean;
  specialValid: boolean;
  coincide: boolean;
}

export const Reset: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  const [conditions, setConditions] = useState<PasswordConditions>({
    lengthValid: false,
    numberValid: false,
    specialValid: false,
    coincide: false,
  });

  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const lengthValid = newPassword.length >= 8;
    const numberValid = /\d/.test(newPassword);
    const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    setConditions((prevConditions) => ({
      ...prevConditions,
      lengthValid,
      numberValid,
      specialValid,
      coincide: newPassword === password2,
    }));
  };

  const handlePasswordChange2 = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword2 = e.target.value;
    setPassword2(newPassword2);

    const coincide = newPassword2 === password;

    setConditions((prevConditions) => ({
      ...prevConditions,
      coincide,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (password === "" || password2 === "") {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (password !== password2) {
      Swal.fire({
        title: "Error",
        text: "Contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    const isAllValid =
      conditions.lengthValid &&
      conditions.numberValid &&
      conditions.specialValid;

    if (!isAllValid) {
      Swal.fire({
        title: "Error",
        text: "La contraseña no cumple con todos los requisitos de seguridad",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    Swal.fire({
      title: "¡Operación Exitosa!",
      text: "Contraseña restablecida exitosamente (Maquetación)",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      navigate("/");
    });
  };

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  React.useEffect(() => {
    if (token) {
      console.log("Token recibido (solo para demostración):", token);
    }
  }, [token]);

  const isFirstPasswordValid = conditions.lengthValid && conditions.numberValid && conditions.specialValid;

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
                <EyeIcon onClick={togglePassword} className="svg-login" />
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

export default Reset;