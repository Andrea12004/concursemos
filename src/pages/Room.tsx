// src/pages/salas.tsx
import React, { useState } from "react";
import { SalasLista } from "@/components/rooms/roomList";
import CarruselSalas from "@/components/rooms/carouselRooms";
import Layout from "@/components/layout/layout";
import { useProgrammedRooms } from '@/lib/services/rooms/useProgrammedRooms';
import '@/components/rooms/css/styles.css';

/**
 * ============================================
 * PÁGINA: SALAS
 * 
 * Muestra:
 * - Carrusel con salas programadas
 * - Lista completa de salas
 * ============================================
 */
export const Salas = () => {
  // Estado de búsqueda (compartido entre componentes)
  const [searchQuery] = useState('');

  // Hook con lógica de salas programadas (para el carrusel)
  const { rooms: programmedRooms } = useProgrammedRooms();

  /**
   * ============================================
   * RENDER PRINCIPAL
   * ============================================
   */
  return (
    <Layout>
      {/* Carrusel de salas programadas - Solo si hay salas */}
      <div className={`div-carrusel-salas ${programmedRooms.length == 0 ? 'hidden' : ''}`}>
          <div className="div-header-carrusel-salas">
            <h3>Partidas Programadas</h3>
          </div>
          <div
            className="flex w-full div-carrusel-salas-global"
            style={{ height: "90%" }}
          >
            {/* ✅ PASAR rooms y searchQuery al carrusel */}
            <CarruselSalas 
              searchQuery={searchQuery} 
            />
          </div>
        </div>

      {/* Lista completa de salas (activas + programadas) */}
      <SalasLista searchQuery={searchQuery} />
    </Layout>
  );
};

export default Salas;