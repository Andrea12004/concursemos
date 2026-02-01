import React from "react";
import Layout from "@/components/layout/layout";
import TusDatos from "@/components/payments/yourdata";
import Historial from "@/components/modals/paymenthistory";
import "@/components/payments/css/styles.css";
import { useAppSelector } from "@/lib/store/hooks";

const Pagos: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <Layout>
      <h3 className="h3-content-perfil">Suscripción</h3>
      <div className="content-usuarios">
        <TusDatos />
        {user?.role == "ADMIN" ? "" : <Historial showAdminButton={false} />}
      </div>
    </Layout>
  );
};

export default Pagos;
