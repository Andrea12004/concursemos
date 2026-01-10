import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/loading";
import "./css/styles.css";
import "./css/payments.css";
import { Input } from '@/components/UI/Inputs/input';

interface FormData {
  numerotarjeta: string;
  año: string;
  mes: string;
  cvc: string;
}

interface Datos {
  nombre: string;
  apellido: string;
  email: string;
  ciudad: string;
  direccion: string;
  celular: string;
}

interface DatosFinal {
  tipoDoc: string;
  Docnumber: string;
}

const Pagar: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [tokenTarjeta, setTokenTarjeta] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem("authResponse");
      if (authResponseStr) {
        const authResponse = JSON.parse(authResponseStr);
        setToken(authResponse?.accesToken || "");
        setUser(authResponse?.user?.id || "");
      }
    } catch (error) {
      console.error("Error al parsear authResponse:", error);
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    numerotarjeta: "",
    año: "",
    mes: "",
    cvc: "",
  });

  const [datos, setDatos] = useState<Datos>({
    nombre: "",
    apellido: "",
    email: "",
    ciudad: "",
    direccion: "",
    celular: "",
  });

  const [datosFinal, setDatosFinal] = useState<DatosFinal>({
    tipoDoc: "CC",
    Docnumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDatosFinal = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDatosFinal({
      ...datosFinal,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.numerotarjeta ||
      !formData.año ||
      !formData.mes ||
      !formData.cvc
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    setLoading(true);

    // Simulación de llamada API
    setTimeout(() => {
      setTokenTarjeta("token_simulado_123");
      setStep((prevStep) => prevStep + 1);
      setLoading(false);

      Swal.fire({
        title: "Éxito",
        text: "Datos de tarjeta validados (simulación)",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }, 1500);
  };

  const DatosPersona = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !datos.nombre ||
      !datos.email ||
      !datos.ciudad ||
      !datos.apellido ||
      !datos.direccion ||
      !datos.celular
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    setLoading(true);

    // Simulación de llamada API
    setTimeout(() => {
      setCustomerId("customer_simulado_456");
      setStep((prevStep) => prevStep + 1);
      setLoading(false);

      Swal.fire({
        title: "Éxito",
        text: "Datos personales guardados (simulación)",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }, 1500);
  };

  const Finalizar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!datosFinal.tipoDoc || !datosFinal.Docnumber) {
      Swal.fire({
        title: "Error",
        text: "Por favor llena todos los campos",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    setLoading(true);

    // Simulación de proceso completo
    setTimeout(() => {
      setLoading(false);

      Swal.fire({
        title: "Operación Exitosa",
        text: "Suscripción generada con éxito (simulación)",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#25293d",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById("pagar")?.classList.add("hidden");
          setStep(1);
          // Limpiar formularios
          setFormData({ numerotarjeta: "", año: "", mes: "", cvc: "" });
          setDatos({
            nombre: "",
            apellido: "",
            email: "",
            ciudad: "",
            direccion: "",
            celular: "",
          });
          setDatosFinal({ tipoDoc: "CC", Docnumber: "" });
        }
      });
    }, 2000);
  };

  const tipoDocOptions = [
    { value: "TI", label: "TI" },
    { value: "CC", label: "CC" },
    { value: "CE", label: "CE" },
    { value: "TE", label: "TE" },
    { value: "PP", label: "PP" },
    { value: "PEP", label: "PEP" },
  ];
  return (
    <>
      <button
        className="div-pagar-ahora"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="pagar"
        onClick={() =>
          document.getElementById("pagar")?.classList.remove("hidden")
        }
      >
        <div>
          <span>Pagar ahora la suscripción</span>
          <p>$20.000</p>
        </div>
        <img src="/svg/pagos/go.svg" alt="" className="no-hover" />
        <img src="/svg/pagos/gohover.svg" alt="" className="hover" />
      </button>

      {/* Modal */}
      <div
        id="pagar"
        className="overlay modal hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog w-full max-w-6xl rounded-lg shadow-lg">
          <div
            className="modal-content"
            style={{ backgroundColor: "#1F2336" }}
          >
            <div className="modal-header flex justify-between items-center p-4 border-gray-700">
              <h3
                className="modal-title text-white"
                style={{ color: "#ff914c", margin: 0 }}
              >
                Portal de Pago
              </h3>
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm"
                aria-label="Close"
                onClick={() =>
                  document.getElementById("pagar")?.classList.add("hidden")
                }
              >
                <img src="/svg/modals/close.svg" alt="Close" />
              </button>
            </div>

            <div
              className="modal-body flex align-middle"
          
            >
              <div className="div-modal-pagar">
                <img src="/images/Logos/Logo-login.png" alt="" />
              </div>
              <div className="div-steps">
                <p
                  className="modal-title mt-1"
                  style={{ fontSize: "16px", color: "#fff" }}
                >
                  Para realizar tu suscripcion debemos validar tus datos
                </p>

                {/* Barra de progreso */}
                <div className="div-circulos-steps mb-10">
                  {/* Círculos con las líneas de conexión */}
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="step-container">
                      {index > 1 && (
                        <div
                          className="line"
                          style={{
                            backgroundColor:
                              step > index - 1 ? "#3cebff" : "#ff914c", // Línea verde si el paso anterior está completado
                          }}
                        />
                      )}
                      <div
                        className="circle"
                        style={{
                          backgroundColor:
                            step >= index ? "#3cebff" : "#ff914c", // Color verde si es pasado, gris si no
                        }}
                      >
                        {index}
                      </div>
                    </div>
                  ))}
                </div>

                {/*FORMS*/}
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {step === 1 && (
                      <form
                        className="w-full h-full flex flex-column gap-1 flex-wrap items-start"
                        onSubmit={handleSubmit}
                      >
                        <div className="div-form-pago-pop">
                          <div className="div-tarjeta">
                            <label htmlFor="numerotarjeta">
                              Número de Tarjeta
                            </label>
                            <Input
                              name="numerotarjeta"
                              value={formData.numerotarjeta}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="div-datos-tarjeta">
                            <div>
                              <label htmlFor="mes">Mes de expiración</label>
                              <Input
                                name="mes"
                                value={formData.mes}
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <label htmlFor="año">Año de expiración</label>
                              <Input
                                name="año"
                                value={formData.año}
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <label htmlFor="cvc">CVC</label>
                              <Input
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="div-button-pagar-pop">
                            <button
                              type="button"
                              className="button-cancelar-pop-pagar"
                              onClick={() =>
                                document
                                  .getElementById("pagar")
                                  ?.classList.add("hidden")
                              }
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="button-siguiente-pop-pagar"
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {step === 2 && (
                      <form
                        className="w-full h-full flex flex-column gap-1 flex-wrap items-start"
                        onSubmit={DatosPersona}
                      >
                        <div className="div-form-pago-pop">
                          <div className="div-datos-tarjeta">
                            <div>
                              <label htmlFor="nombre">Nombres</label>
                              <Input
                                name="nombre"
                                value={datos.nombre}
                                onChange={handleChangeDatos}
                              />
                            </div>
                            <div>
                              <label htmlFor="apellido">Apellidos</label>
                              <Input
                                name="apellido"
                                value={datos.apellido}
                                onChange={handleChangeDatos}
                              />
                            </div>
                            <div>
                              <label htmlFor="email">Email</label>
                              <Input
                                type="email"
                                name="email"
                                value={datos.email}
                                onChange={handleChangeDatos}
                              />
                            </div>
                          </div>

                          <div className="div-datos-tarjeta">
                            <div>
                              <label htmlFor="ciudad">Ciudad</label>
                              <Input
                                name="ciudad"
                                value={datos.ciudad}
                                onChange={handleChangeDatos}
                              />
                            </div>
                            <div>
                              <label htmlFor="direccion">Direccion</label>
                              <Input
                                name="direccion"
                                value={datos.direccion}
                                onChange={handleChangeDatos}
                              />
                            </div>
                            <div>
                              <label htmlFor="celular">Celular</label>
                              <Input
                                name="celular"
                                value={datos.celular}
                                onChange={handleChangeDatos}
                              />
                            </div>
                          </div>

                          <div className="div-button-pagar-pop">
                            <button
                              type="button"
                              className="button-cancelar-pop-pagar"
                              onClick={() =>
                                document
                                  .getElementById("pagar")
                                  ?.classList.add("hidden")
                              }
                            >
                              Cancelar
                            </button>
                            <button
                              className="button-siguiente-pop-pagar"
                              type="submit"
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {step === 3 && (
                      <form
                        className="w-full h-full flex flex-column gap-1 flex-wrap items-start"
                        onSubmit={Finalizar}
                      >
                        <div className="div-form-pago-pop">
                          <div className="div-tarjeta">
                            <label htmlFor="Docnumber">Documento</label>
                            <div>
                              <select
                                value={datosFinal.tipoDoc}
                                name="tipoDoc"
                                onChange={handleChangeDatosFinal}
                              >
                                <option value="TI">TI</option>
                                <option value="CC">CC</option>
                                <option value="CE">CE</option>
                                <option value="TE">TE</option>
                                <option value="PP">PP</option>
                                <option value="PEP">PEP</option>
                              </select>
                              <Input
                                name="Docnumber"
                                value={datosFinal.Docnumber}
                                onChange={handleChangeDatosFinal}
                              />
                            </div>
                          </div>

                          <div className="div-button-pagar-pop">
                            <button
                              type="button"
                              className="button-cancelar-pop-pagar"
                              onClick={() =>
                                document
                                  .getElementById("pagar")
                                  ?.classList.add("hidden")
                              }
                            >
                              Cancelar
                            </button>
                            <button
                              className="button-siguiente-pop-pagar"
                              type="submit"
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagar;
