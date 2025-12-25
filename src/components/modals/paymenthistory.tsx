import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./css/styles.css";

// Definición de tipos
interface Payment {
  id: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  startpay?: string;
  endpay?: string;
  amount?: number;
  status?: string;
}

interface AuthResponse {
  accesToken: string;
  user: {
    id: number;
    profile: {
      id: number;
    };
  };
}
interface PagosProps {
  showAdminButton?: boolean; 
}

const Pagos: React.FC<PagosProps> = ({ showAdminButton = true }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<number | null>(null);
  const [profileID, setProfileID] = useState<number | null>(null);
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  // Datos simulados para desarrollo
  const mockPagos: Payment[] = [
    {
      id: 1,
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-01-31",
      amount: 20000,
      status: "Pagado",
    },
    {
      id: 2,
      startpay: "2024-02-01T10:30:00",
      endpay: "2024-02-28T10:30:00",
      amount: 20000,
      status: "Pagado",
    },
    {
      id: 3,
      currentPeriodStart: "2024-03-01",
      currentPeriodEnd: "2024-03-31",
      amount: 20000,
      status: "Pagado",
    },
    {
      id: 4,
      startpay: "2024-04-01T10:30:00",
      endpay: "2024-04-30T10:30:00",
      amount: 20000,
      status: "Pendiente",
    },
    {
      id: 5,
      currentPeriodStart: "2024-05-01",
      currentPeriodEnd: "2024-05-31",
      amount: 20000,
      status: "Pagado",
    },
  ];

  useEffect(() => {
    // Simular obtención de datos de autenticación
    const mockAuthResponse: AuthResponse = {
      accesToken: "mock-token-12345",
      user: {
        id: 1,
        profile: {
          id: 101,
        },
      },
    };

    localStorage.setItem("authResponse", JSON.stringify(mockAuthResponse));

    const authResponse = JSON.parse(
      localStorage.getItem("authResponse") || "{}"
    ) as AuthResponse;
    if (authResponse.accesToken) {
      setToken(authResponse.accesToken);
      setUserID(authResponse.user.id);
      setProfileID(authResponse.user.profile.id);
    }
  }, []);

  const getPagos = async (): Promise<void> => {
    try {
      // Simular llamada a API con retardo
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Usar datos simulados
      const subscriptions = mockPagos.slice(0, 3); // Primeros 3 como suscripciones
      if (subscriptions.length > 0) {
        setPagos((prevState) => [...prevState, ...subscriptions]);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Estamos teniendo fallas técnicas",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const getPagosManuales = async (): Promise<void> => {
    try {
      // Simular llamada a API con retardo
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Usar datos simulados (los últimos 2 como manuales)
      const manualPayments = mockPagos.slice(3); // Últimos 2 como pagos manuales
      if (manualPayments.length > 0) {
        setPagos((prevState) => [...prevState, ...manualPayments]);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Estamos teniendo fallas técnicas",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  useEffect(() => {
    if (token) {
      getPagos();
      getPagosManuales();
    }
  }, [token]);

  // Lógica de paginación
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPagos = pagos.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(pagos.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    return dateString.replaceAll("-", "/").split("T")[0];
  };

  return (
    <div className="ultimos-pagos-perfil">
      <div className="header-ultimos-pagos">
        <h6>Tus últimos pagos</h6>
        {showAdminButton && (
          <Link to="/pagos">Administrar suscripción</Link>
        )}
      </div>

      {pagos.length > 0 ? (
        currentPagos.map((item) => {
          return (
            <div className="div-ultimos-pagos-perfil" key={item.id}>
              <p className="fecha-pagos-perfil">
                {item.currentPeriodStart
                  ? item.currentPeriodStart.replaceAll("-", "/")
                  : item.startpay?.replaceAll("-", "/").split("T")[0] ?? ""}
              </p>

              <p className="plan-pagos-perfil">
                {item.currentPeriodEnd
                  ? item.currentPeriodEnd.replaceAll("-", "/")
                  : item.endpay?.replaceAll("-", "/").split("T")[0] ?? ""}
              </p>
              <p className="valor-pagos-perfil">$20.000</p>
              <p className="pagado-pagos-perfil">Pagado</p>
            </div>
          );
        })
      ) : (
        <div>
          <p className="text-white">No se registran pagos</p>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {/* Mostrar los números de las páginas */}
        {Array.from(
          { length: Math.ceil(pagos.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(pagos.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagos;
