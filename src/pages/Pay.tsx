import React from "react";
import Layout from "@/components/layout/layout";
import TusDatos from "@/components/payments/yourdata";
import Historial from "@/components/modals/paymenthistory";
import "@/components/payments/css/styles.css";
import { useAuth } from "@/lib/context/auth";

const Pagos: React.FC = () => {
  const auth = useAuth();
  return (
    <Layout>
      <h3 className="h3-content-perfil">Suscripción</h3>
      <div className="content-usuarios">
        <TusDatos />
        {auth.state?.role == "ADMIN" ? (
          ""
        ) : (
          <Historial showAdminButton={false} />
        )}
      </div>
    </Layout>
  );
};

export default Pagos;
