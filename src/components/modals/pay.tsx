import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/lib/store/hooks';
import { useLogout } from '@/lib/hooks/useLogout';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { showAlert } from '@/lib/utils/showAlert';
import {
  createCardTokenEndpoint,
  createCustomerEndpoint,
  subscribeEndpoint,
  chargePaymentEndpoint,
  confirmPaymentEndpoint
} from '@/lib/api/pay';
import Loader from '../loader/loading';
import "./css/styles.css";
import "./css/payments.css";
import { Input } from '@/components/UI/Inputs/input';

const Pagar = () => {
  const { logout } = useLogout();
  const { user } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(1);

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenTarjeta, setTokentarjeta] = useState('');
  const [customerId, setCustomerid] = useState('');
  const [ip, setIp] = useState<string | null>(null);

  // Obtener token
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || 
                     localStorage.getItem('cnrsms_token') || '';
    setToken(authToken);
  }, []);

  // Obtener IP del usuario
  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setIp(response.data.ip);
      })
      .catch((error) => {
        console.error("Error al obtener la IP:", error);
      });
  }, []);

  const [formData, setFormData] = useState({
    numerotarjeta: "",
    año: "",
    mes: "",
    cvc: ""
  });

  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    email: "",
    ciudad: "",
    direccion: "",
    celular: "",
  });

  const [datosFinal, setDatosfinal] = useState({
    tipoDoc: "CC",
    Docnumber: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeDatos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeDatosfinal = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatosfinal({
      ...datosFinal,
      [e.target.name]: e.target.value
    });
  };

  // PASO 1: Validar tarjeta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numerotarjeta || !formData.año || !formData.mes || !formData.cvc) {
      showAlert('Error', 'Por favor llena todos los campos', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await createCardTokenEndpoint(
        {
          number: formData.numerotarjeta,
          exp_year: formData.año,
          exp_month: formData.mes,
          cvc: formData.cvc
        },
        token
      );

      if (response.token?.id) {
        setStep((prevStep) => prevStep + 1);
        setTokentarjeta(response.token.id);
      } else {
        showAlert('Tarjeta inválida', 'Por favor revisa los datos de la tarjeta', 'warning');
      }
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Datos personales
  const DatosPersona = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datos.nombre || !datos.email || !datos.ciudad || 
        !datos.apellido || !datos.direccion || !datos.celular) {
      showAlert('Error', 'Por favor llena todos los campos', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await createCustomerEndpoint(
        {
          token_card: tokenTarjeta,
          name: datos.nombre,
          last_name: datos.apellido,
          email: datos.email,
          default: true,
          city: datos.ciudad,
          address: datos.direccion,
          phone: datos.celular,
          cell_phone: datos.celular
        },
        token
      );

      if (response.customer?.data?.customerId) {
        setStep((prevStep) => prevStep + 1);
        setCustomerid(response.customer.data.customerId);
      }
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  };

  // PASO 3: Finalizar y suscribirse
  const Finalizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datosFinal.tipoDoc || !datosFinal.Docnumber) {
      showAlert('Error', 'Por favor llena todos los campos', 'warning');
      return;
    }

    if (!user?.id) {
      showAlert('Error', 'Usuario no encontrado', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await subscribeEndpoint(
        user.id,
        {
          id_plan: "concursemos",
          customer: customerId,
          token_card: tokenTarjeta,
          doc_type: datosFinal.tipoDoc,
          doc_number: datosFinal.Docnumber
        },
        token
      );

      if (response.subscription?.subscriptionId) {
        await pagarSuscripcion();
      }
    } catch (error) {
      handleAxiosError(error, logout);
      setLoading(false);
    }
  };

  // Realizar cargo de pago
  const pagarSuscripcion = async () => {
    if (!ip || !user?.id) {
      showAlert('Error', 'Datos incompletos', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await chargePaymentEndpoint(
        {
          id_plan: "concursemos",
          name: datos.nombre,
          last_name: datos.apellido,
          email: datos.email,
          value: 20000,
          currency: "COP",
          customer_id: customerId,
          token_card: tokenTarjeta,
          doc_type: datosFinal.tipoDoc,
          doc_number: datosFinal.Docnumber,
          ip: ip
        },
        token
      );

      if (response.charge?.success === true && response.charge?.status === true) {
        await ActualizarPago();
      }
    } catch (error) {
      handleAxiosError(error, logout);
      setLoading(false);
    }
  };

  // Confirmar pago en el backend
  const ActualizarPago = async () => {
    if (!user?.id) return;

    try {
      await confirmPaymentEndpoint(user.id, token);

      showAlert(
        'Operación Exitosa',
        'Suscripción generada con éxito',
        'success'
      ).then(() => {
        logout();
      });
    } catch (error) {
      handleAxiosError(error, logout);
    } finally {
      setLoading(false);
    }
  };

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

            <div className="modal-body flex align-middle">
              <div className="div-modal-pagar">
                <img src="/images/Logos/Logo-login.png" alt="" />
              </div>
              <div className="div-steps">
                <p
                  className="modal-title mt-1"
                  style={{ fontSize: "16px", color: "#fff" }}
                >
                  Para realizar tu suscripción debemos validar tus datos
                </p>

                {/* Barra de progreso */}
                <div className="div-circulos-steps mb-10">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="step-container">
                      {index > 1 && (
                        <div
                          className="line"
                          style={{
                            backgroundColor:
                              step > index - 1 ? "#3cebff" : "#ff914c",
                          }}
                        />
                      )}
                      <div
                        className="circle"
                        style={{
                          backgroundColor:
                            step >= index ? "#3cebff" : "#ff914c",
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
                              <label htmlFor="direccion">Dirección</label>
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
                                onChange={handleChangeDatosfinal}
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
                                onChange={handleChangeDatosfinal}
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
                              Finalizar
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