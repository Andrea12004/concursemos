import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SalasLista } from "@/components/rooms/roomList";
import CarruselSalas from "@/components/rooms/carouselRooms";
import Layout from "@/components/layout/layout";
import Swal from "sweetalert2";
// import axios from "axios";
import '@/components/rooms/css/styles.css'

import type { Room, AuthResponse } from '@/lib/types/Room';

export const Salas: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authResponse");
    navigate("/");
  };

  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem("authResponse");
      if (authResponseStr) {
        const authResponse: AuthResponse = JSON.parse(authResponseStr);
        setToken(authResponse?.accesToken || "");
        setUserID(authResponse?.user?.profile?.id || "");
      }
    } catch (error) {
      console.error("Error al parsear authResponse:", error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getRooms();
    }
  }, [token]);

  const getRooms = async () => {
    const headers = {
      cnrsms_token: token,
    };

    try {
      // const response = await axios.get<Room[]>(`/rooms/all`, { headers });

      // // Filtramos solo las salas que tienen start_date diferente a null
      // const filteredRooms = response.data.filter(
      //   (room) => room.start_date !== null
      // );

      // Guardamos las salas filtradas
      // setRooms(filteredRooms);
    } catch (error: any) {
      console.error("Error en getRooms:", error);

      if (error.response?.data?.message === "Token expirado") {
        Swal.fire({
          title: "Token Expirado",
          text: "Vuelve a ingresar a la plataforma",
          icon: "error",
          confirmButtonText: "Ok",
        });
        logout();
      } else {
        Swal.fire({
          title: "Error",
          text: "Estamos teniendo fallas tecnicas",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };


  return (
    <Layout>

        <div
          className={`div-carrusel-salas`} 
        >
          <div className="div-header-carrusel-salas">
            <h3>Partidas Programadas</h3>
          </div>
          <div
            className="flex w-full div-carrusel-salas-global"
            style={{ height: "90%" }}
          >
            <CarruselSalas searchQuery={searchQuery} />
          </div>
        </div>

        <SalasLista searchQuery={searchQuery} />

    </Layout>
  );
};

export default Salas;