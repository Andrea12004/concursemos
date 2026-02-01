import React, { useState } from "react";
import Layout from "@/components/layout/layout";
import Pagos from "@/components/modals/paymenthistory";
import EditarPerfil from "@/components/profile/editProfile";
import Carrusel from "@/components/profile/profileCarousel";
import Estadisticas from "@/components/profile/statisticalProfile";
import { useAppSelector } from "@/lib/store/hooks"; 

const Perfil: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
    const { user } = useAppSelector((state) => state.auth)

  return (
    <Layout setSearchQuery={setSearchQuery}>
      <h3 className="h3-content-perfil">Editar perfil</h3>
      <div className="content-perfil">
        <div className="content-perfil-editar">
          <EditarPerfil />
          {user?.role == "ADMIN" ? "" : <Pagos showAdminButton={true} />}
          <div className="carrusel-perfil">
            <p>Tu partida programada</p>
            <Carrusel  />
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
