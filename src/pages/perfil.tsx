import React from "react";
import { useAuth } from '@/lib/auth';
import Layout from "@/components/layout/layout";
import Pagos from "@/components/modals/paymenthistory";
import EditarPerfil from "@/components/perfil/editar-perfil";
import Carrusel from "@/components/perfil/carrusel-perfil";
import Estadisticas from "@/components/perfil/estadisticas-perfil";


const Perfil: React.FC = () => {

  const auth = useAuth();

  return (
    <Layout>
      <h3 className="h3-content-perfil">Editar perfil</h3>
      <div className="content-perfil">
        <div className="content-perfil-editar">
          <EditarPerfil />
          {auth.state?.role == "ADMIN" ? "" : <Pagos />}
          <div className="carrusel-perfil">
            <p>Tu partida programada</p>
            <Carrusel />
          </div>
        </div>

        <div className="content-perfil-stats">
          <Estadisticas />
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
