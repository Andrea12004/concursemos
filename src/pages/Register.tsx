import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/UI/Inputs/input";
import EyeIcon from "@/components/UI/svg/EyeIcon";
import CheckboxWithLabel from "@/components/UI/Checkbox/CheckboxWithLabel";
import Button from "@/components/UI/Button/button";
import PasswordCondition from "@/components/UI/svg/PasswordCondition";
import { useRegister } from "@/lib/hooks/useRegister";
import "@/css/registro.css";

export const Registro: React.FC = () => {
  const {
    formData,
    password,
    showPassword,
    check,
    conditions,
    togglePassword,
    handlePasswordChange,
    handleChange,
    handleSubmit,
    setCheck
  } = useRegister();

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

              <Button type="submit">
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
