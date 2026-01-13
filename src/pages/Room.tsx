// src/pages/salas.tsx
import React, { useState } from "react";
import { SalasLista } from "@/components/rooms/roomList";
import CarruselSalas from "@/components/rooms/carouselRooms";
import Layout from "@/components/layout/layout";
import { useProgrammedRooms } from '@/lib/services/rooms/useProgrammedRooms';
import '@/components/rooms/css/styles.css';

export const Salas = () => {
  // Estado de búsqueda (compartido entre componentes)
  const [searchQuery] = useState('');

  // Hook con lógica de salas programadas (para el carrusel)
  const { rooms: programmedRooms } = useProgrammedRooms();

  return (
    <Layout>
      <div className={`div-carrusel-salas ${programmedRooms.length == 0 ? 'hidden' : ''}`}>
          <div className="div-header-carrusel-salas">
            <h3>Partidas Programadas</h3>
          </div>
          <div
            className="flex w-full div-carrusel-salas-global"
            style={{ height: "90%" }}
          >

            <CarruselSalas 
              searchQuery={searchQuery} 
            />
          </div>
        </div>
      <SalasLista searchQuery={searchQuery} />
    </Layout>
  );
};

export default Salas;