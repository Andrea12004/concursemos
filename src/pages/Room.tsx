// src/pages/salas.tsx
import  { useState } from "react";
import { SalasLista } from "@/components/rooms/roomList";
import CarruselSalas from "@/components/rooms/carouselRooms";
import Layout from "@/components/layout/layout";
import { useProgrammedRooms } from '@/lib/services/rooms/useProgrammedRooms';
import '@/components/rooms/css/styles.css';

export const Salas = () => {

   const [searchQuery, setSearchQuery] = useState<string>("");
  const { rooms: programmedRooms } = useProgrammedRooms();

  return (
    <Layout setSearchQuery={setSearchQuery}>
      <div className={`div-carrusel-salas ${programmedRooms.length == 0 ? 'hidden' : ''}`}>
          <div className="div-header-carrusel-salas">
            <h3>Partidas Programadas</h3>
          </div>
          <div
            className="flex w-full div-carrusel-salas-global"
            style={{ height: "90%" }}
          >

            <CarruselSalas  />
          </div>
        </div>
      <SalasLista searchQuery={searchQuery} />
    </Layout>
  );
};

export default Salas;