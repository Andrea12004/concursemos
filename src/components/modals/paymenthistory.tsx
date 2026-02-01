import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/lib/store/hooks";
import { useLogout } from '@/lib/hooks/useLogout';
import { handleAxiosError } from '@/lib/utils/parseErrors';
import { 
  getSubscriptionsEndpoint,
  getManualPaymentsEndpoint 
} from '@/lib/api/pay';
import "./css/styles.css";

// Tipos para los pagos
interface Subscription {
  id: string | number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  startpay?: string;
  endpay?: string;
}

interface ManualPayment {
  id: string | number;
  startpay: string;
  endpay: string;
}

type Payment = Subscription | ManualPayment;

// Props del componente
interface HistorialProps {
  showAdminButton?: boolean;
}

export const Historial: React.FC<HistorialProps> = ({ showAdminButton = false }) => {
  const { logout } = useLogout();
  const { user } = useAppSelector((state) => state.auth);
  
  const [token, setToken] = useState('');
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [_loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Obtener token
  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || 
                     localStorage.getItem('cnrsms_token') || '';
    setToken(authToken);
  }, []);

  // Obtener suscripciones
  const getPagos = async () => {
    if (!token || !user?.id) return;

    try {
      const response = await getSubscriptionsEndpoint(user.id, token);
      
      if (response.subscriptions && response.subscriptions.length > 0) {
        setPagos(prevState => [...prevState, ...response.subscriptions]);
      }
    } catch (error) {
      handleAxiosError(error, logout);
    }
  };

  // Obtener pagos manuales
  const getPagosManuales = async () => {
    if (!token || !user?.id) return;

    try {
      const response = await getManualPaymentsEndpoint(user.id, token);
      
      if (response && response.length > 0) {
        setPagos(prevState => [...prevState, ...response]);
      }
    } catch (error) {
      handleAxiosError(error, logout);
    }
  };

  // Cargar pagos
  useEffect(() => {
    if (token && user?.id) {
      setLoading(true);
      Promise.all([getPagos(), getPagosManuales()])
        .finally(() => setLoading(false));
    }
  }, [token, user?.id]);

  // Lógica de paginación
  const indexOfLastRoom = currentPage * itemsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - itemsPerPage;
  const currentPagos = pagos.length > 0 
    ? pagos.slice(indexOfFirstRoom, indexOfLastRoom) 
    : pagos;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
                {'currentPeriodStart' in item && item.currentPeriodStart
                  ? item.currentPeriodStart.replaceAll("-", "/")
                  : 'startpay' in item && item.startpay
                  ? item.startpay.replaceAll("-", "/").split("T")[0]
                  : ""}
              </p>
              <p className="plan-pagos-perfil">
                {'currentPeriodEnd' in item && item.currentPeriodEnd
                  ? item.currentPeriodEnd.replaceAll("-", "/")
                  : 'endpay' in item && item.endpay
                  ? item.endpay.replaceAll("-", "/").split("T")[0]
                  : ""}
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
      
      {pagos.length > itemsPerPage && (
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
      )}
    </div>
  );
};

export default Historial;