import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Input } from "@/components/UI/Inputs/input";
import EyeIcon from "@/components/UI/svg/EyeIcon";
import CheckboxWithLabel from "@/components/UI/Checkbox/CheckboxWithLabel";
import "@/css/registro.css";
import Button from "@/components/UI/Button/button";
import PasswordCondition from "@/components/UI/svg/PasswordCondition";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  nickname: string;
  password: string;
}

interface PasswordConditions {
  lengthValid: boolean;
  numberValid: boolean;
  specialValid: boolean;
}

export const Registro: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [conditions, setConditions] = useState<PasswordConditions>({
    lengthValid: false,
    numberValid: false,
    specialValid: false,
  });

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    nickname: "",
    password: "",
  });

  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setFormData({
      ...formData,
      password: newPassword,
    });

    // Verificar las condiciones
    const lengthValid = newPassword.length >= 8;
    const numberValid = /\d/.test(newPassword);
    const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    setConditions({
      lengthValid,
      numberValid,
      specialValid,
    });
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validación de campos vacíos
    if (
      !formData.nombre ||
      !formData.telefono ||
      !formData.email ||
      !password ||
      !formData.ciudad ||
      !formData.nickname
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Validación de términos y condiciones
    if (!check) {
      Swal.fire({
        title: "Error",
        text: "Por favor acepta los términos y condiciones",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Validación de contraseña
    if (
      !conditions.specialValid ||
      !conditions.numberValid ||
      !conditions.lengthValid
    ) {
      Swal.fire({
        title: "Error",
        text: "Contraseña insegura",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Simulación de registro exitoso
    Swal.fire({
      title: "¡Registro Exitoso!",
      text: "Tu cuenta ha sido creada correctamente",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      navigate("/");
    });
  };

  const handleDemoSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Solo para demostración - mostrar datos en consola
    console.log("Datos del formulario:", formData);
    console.log("Contraseña validada:", conditions);
    console.log("Términos aceptados:", check);

    Swal.fire({
      title: "Maquetación",
      text: "Este es solo un formulario de maquetación. Los datos no se enviarán a ningún servidor.",
      icon: "info",
      confirmButtonText: "Entendido",
    });
  };

  return (
    <>
      <div className="fondo-registro">
        <div className="div-form-registro">
          {/* encabezado */}
          <div className="header-form-registro">
            <div className="logo-registro">
              <img
                src="/images/Logos/Logo-Auth.png"
                className="logo-img-registro"
                alt="Logo"
              />
            </div>
            <div className="div-header-text-registro">
              <h3 className="h3-class-registro">Registrate Ahora</h3>
              <p className="descripcion-registro">
                Hola, Bienvenido a concursemos, acá te registras para ingresar a
                nuestra plataforma
              </p>
            </div>
          </div>
          {/* end::encabezado */}

          {/* contenido form */}
          <div className="div-contenido-registro">
            <form className="form-registro" onSubmit={handleSubmit}>
              <div className="div-name-tel">
                <Input
                  type="text"
                  placeholder="Nombre Completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input"
                  width="48%"
                  height="100%"
                />
                <Input
                  type="text"
                  placeholder="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="input"
                  width="48%"
                  height="100%"
                />
              </div>

              <div className="div-name-tel">
                <Input
                  type="text"
                  placeholder="Ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="input"
                  width="48%"
                  height="100%"
                />
                <Input
                  type="text"
                  placeholder="Usuario"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="input"
                  width="48%"
                  height="100%"
                />
              </div>

              <Input
                type="email"
                className="input"
                placeholder="Correo"
                name="email"
                value={formData.email}
                onChange={handleChange}
                width="98%"
              />

              <div className="div-input-registro">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="input2"
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
                <div>
                  <CheckboxWithLabel
                    id="cbtest-19"
                    name="terminos"
                    label=" Aceptar terminos y condiciones"
                    checked={check}
                    onChange={(e) => setCheck(e.target.checked)}
                  />
                </div>
              </div>

              <Button type="submit" className="button-ingresar-registro">
                Registrarme ahora
              </Button>

              <div className="div-register-link-registro">
                <p className="label-register-link-registro">
                  ¿Ya tienes cuenta?
                </p>
                <Link to="/" className="register-link-registro">
                  Ingresa Ahora
                </Link>
              </div>
            </form>
          </div>
          {/* end::contenido form */}
        </div>
        <p className="copyraight">©Copyright concursemos 2025</p>
      </div>
    </>
  );
};

export default Registro;
