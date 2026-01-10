import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagos from "@/components/modals/pay";
import { Input } from "@/components/UI/Inputs/input";
import Swal from "sweetalert2";
import "./css/styles.css";
import { useAuth } from "@/lib/context/auth";

interface FormData {
  nickname: string;
  telefono: string;
  email: string;
  city: string;
  cc: string;
  genero: string;
  photo: string | File;
}

interface AuthResponse {
  accesToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastPaymentDate: string;
    profile: {
      id: string;
      photoUrl?: string;
      City: string;
      CC: string;
      Gender: string;
    };
  };
}

export const TusDatos: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    telefono: "",
    email: "",
    city: "",
    cc: "",
    genero: "",
    photo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value, type } = e.target;

    if (type === "file" && files) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [lastPaymentDate, setLastPaymentDate] = useState<string>("");
  const [nextPaymentDate, setNextPaymentDate] = useState<string>("");
  const [profileID, setProfileID] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [suscriptionId, setSuscriptionId] = useState<string>("");

  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem("authResponse");
      if (!authResponseStr) return;

      const authResponse: AuthResponse = JSON.parse(authResponseStr);

      setToken(authResponse?.accesToken || "");
      setUserID(authResponse?.user?.id || "");
      setProfileID(authResponse?.user?.profile?.id || "");

      if (authResponse?.user?.profile?.photoUrl) {
        setPhoto(authResponse.user.profile.photoUrl);
      }

      setFormData({
        nickname: authResponse?.user?.firstName || "",
        telefono: authResponse?.user?.lastName || "",
        email: authResponse?.user?.email || "",
        city: authResponse?.user?.profile?.City || "",
        cc: authResponse?.user?.profile?.CC || "",
        genero: authResponse?.user?.profile?.Gender || "",
        photo: "",
      });

      if (authResponse?.user?.lastPaymentDate) {
        setLastPaymentDate(authResponse.user.lastPaymentDate);

        const paymentDate = new Date(authResponse.user.lastPaymentDate);
        paymentDate.setDate(paymentDate.getDate() + 30);
        const formattedNextPaymentDate = paymentDate
          .toISOString()
          .split("T")[0];

        setNextPaymentDate(formattedNextPaymentDate);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  }, []);

  const confirmCancel = () => {
    Swal.fire({
      title: "¿Estás Seguro?",
      text: "¿Deseas cancelar tu suscipción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Cancelar suscripcion",
      cancelButtonText: "Regresar",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelSuscription();
      }
    });
  };

  const cancelSuscription = async () => {
    // Simulación de cancelación
    Swal.fire({
      title: "Operación Exitosa",
      text: "Se ha cancelado tu suscripción (simulación)",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#25293d",
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <div className="div-tusdatos">
      <div>
        <img
          src={photo || "/images/Logos/Logo-login.png"}
          alt=""
          className="imagen-perfil-tusdatos"
        />
        <div>
          <Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Nombre"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
          />
          <Input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Telefono"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
          />
        </div>
        <div>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
          />
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ciudad"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
          />
        </div>
        <div>
          <Input
            type="text"
            name="cc"
            value={formData.cc}
            onChange={handleChange}
            placeholder="Documento"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
          />
          <Input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            placeholder="Genero"
            className="pagos-input disabled:opacity-50 cursor-not-allowed"
            noFocusRing={true}
          />
        </div>
      </div>
      <div className="div-datos-operacion">
        <div className="div-plan">
          <div>
            <span>Tu plan se renovará</span>
            <p>{lastPaymentDate ? nextPaymentDate : "Periodo de prueba"}</p>
          </div>
          <img src="/svg/pagos/suscripcion.svg" alt="" />
        </div>

        <div className="div-plan">
          <div>
            <span>Costo de suscripción</span>
            <p>$20.000</p>
          </div>
          <img src="/svg/pagos/wallet.svg" alt="" />
        </div>

        <div>
          <Pagos />
        </div>

        <div className="div-cancelar-suscripcion">
          {auth.state?.role === "BASIC" && (
            <button onClick={confirmCancel}>
              Cancelar Suscripción
              <img src="/svg/pagos/cancelar-pago.svg" alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TusDatos;
