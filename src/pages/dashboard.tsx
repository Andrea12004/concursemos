import React, { useState } from "react";
import Layout from "@/components/layout/layout";
import { Link } from "react-router-dom";
import Banner from "@/components/dashboard/banner";
import Carrusel from "@/components/dashboard/carousel";
import '@/components/dashboard/css/styles.css'
import Estadisticas from "@/components/dashboard/statistics";

const Dashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <Layout setSearchQuery={setSearchQuery}>
      <Banner />
      <div className="div-carrusel-stats">
        <div className="div-carrusel">
          <div className="header-carrusel">
            <h3>Lista de partidas</h3>
            <Link to="/salas">Ver más partidas</Link>
          </div>
          <div className="carrusel">
            <Carrusel searchQuery={searchQuery} />
          </div>
        </div>
         <Estadisticas/>
      </div>
    </Layout>
  );
};

export default Dashboard;
