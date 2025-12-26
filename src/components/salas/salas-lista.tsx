import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MuiTable from "@/components/UI/Table/Table/index";
import { getColumnsSalas } from "@/lib/constants/SalasColumnsConfig";
import "./css/table.css";

import { LevelSelect } from "@/components/UI/Select/LevelSelect";
import "@/components/salas/css/styles.css";

// Definir tipos
interface Profile {
  id: string;
  level: string;
}

interface Category {
  category: string;
}

interface Room {
  id: string;
  room_name: string;
  is_private: boolean;
  profile: Profile;
  start_date: string | null;
  categories: Category[];
  number_questions: number;
  room_code: string;
  max_user: number;
  time_question: number;
  state: string;
}

interface SalasListaProps {
  searchQuery: string;
}

// Datos mock para desarrollo
const mockRooms: Room[] = [
  {
    id: "1",
    room_name: "junio 29",
    is_private: false,
    profile: {
      id: "user123",
      level: "TIBURON",
    },
    start_date: null,
    categories: [{ category: "Territorial 1" }, { category: "territorial 11" }],
    number_questions: 10,
    room_code: "ABC123",
    max_user: 5000,
    time_question: 15,
    state: "ACTIVA",
  },
  {
    id: "2",
    room_name: "Torneo Master",
    is_private: true,
    profile: {
      id: "user456",
      level: "MASTER",
    },
    start_date: "2024-12-15 18:00:00",
    categories: [
      { category: "Matemáticas" },
      { category: "Ciencias" },
      { category: "Historia" },
    ],
    number_questions: 20,
    room_code: "DEF456",
    max_user: 1000,
    time_question: 30,
    state: "ACTIVA",
  },
  {
    id: "3",
    room_name: "Liga de Delfines",
    is_private: false,
    profile: {
      id: "user789",
      level: "DELFIN",
    },
    start_date: "2024-12-10 20:00:00",
    categories: [{ category: "Geografía" }, { category: "Arte" }],
    number_questions: 15,
    room_code: "GHI789",
    max_user: 2000,
    time_question: 20,
    state: "ACTIVA",
  },
];

export function SalasLista({ searchQuery }: SalasListaProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [userID, setUserID] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const auth = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [connectedCounts, setConnectedCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Obtener datos del usuario: role desde el AuthProvider, userID y token desde el `authResponse` (simulación)
  useEffect(() => {
    // Role proviene del AuthProvider central cuando esté disponible
    setRole(auth.state.role || "");

    const authResponseString = localStorage.getItem("authResponse");
    if (authResponseString) {
      try {
        const authResponse = JSON.parse(authResponseString);
        setToken(authResponse.accesToken);
        setUserID(authResponse.user.profile.id);
      } catch (error) {
        console.error("Error parsing auth response:", error);
      }
    }
  }, [auth.state.role]);

  // Obtener salas
  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      try {
        if (token) {
          // Para desarrollo, usa datos mock
          // const headers = { cnrsms_token: token };
          // const response = await axios.get(`rooms/all`, { headers });
          // const filteredRooms = response.data.filter((room: Room) =>
          //   room.state !== 'FINALIZADA' && room.state !== 'JUGANDO'
          // );
          // setRooms(filteredRooms);

          // Usar datos mock temporalmente
          setRooms(mockRooms);
        }
      } catch (error: any) {
        if (error.response?.data?.message === "Token expirado") {
          Swal.fire({
            title: "Token Expirado",
            text: "Vuelve a ingresar a la plataforma",
            icon: "error",
            confirmButtonText: "Ok",
          });
          localStorage.removeItem("authResponse");
          navigate("/");
        } else {
          Swal.fire({
            title: "Error",
            text: "Estamos teniendo fallas técnicas",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
        // En caso de error, usa datos mock
        setRooms(mockRooms);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [token, navigate]);

  // Filtrar salas por búsqueda y nivel
  const filteredRooms = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];

    let filtered = rooms.filter((room) =>
      room.room_name.toLowerCase().includes(searchQuery.toLowerCase() || "")
    );

    if (selectedLevel) {
      filtered = filtered.filter(
        (room) => room.profile.level === selectedLevel
      );
    }

    return filtered;
  }, [rooms, searchQuery, selectedLevel]);

  // Socket para contar jugadores conectados
  //   useEffect(() => {
  //     filteredRooms.forEach((room) => {
  //       socket.emit('listConnectedProfiles', { roomCode: room.room_code });

  //       socket.on('connectedProfiles', (profiles) => {
  //         setConnectedCounts((prev) => ({
  //           ...prev,
  //           [room.room_code]: profiles.profiles.length,
  //         }));
  //       });
  //     });

  //     return () => {
  //       socket.off('connectedProfiles');
  //     };
  //   }, [filteredRooms]);

  // Preparar datos para la tabla
  const tableRows = useMemo(() => {
    return filteredRooms.map((room) => ({
      id: room.id,
      room_name: room.room_name,
      room_type: room.is_private ? "PRIVADA" : "PUBLICA",
      player_level: room.profile.level,
      level_image: `/images/Niveles/${room.profile.level}.png`,
      start_date: room.start_date || "No programada",
      categories: room.categories
        ? room.categories.map((cat) => cat.category).join(", ")
        : "Cargando...",
      number_questions: `${room.number_questions} Preguntas`,
      players_count: `${connectedCounts[room.room_code] || 0} de ${
        room.max_user
      }`,
      time_question: `${room.time_question} segundos`,
      room_code: room.room_code,
      can_delete: role === "ADMIN" || room.profile.id === userID,
    }));
  }, [filteredRooms, connectedCounts, role, userID]);

  // Obtener columnas
  const columns = useMemo(
    () =>
      getColumnsSalas(
        (roomCode: string) => navigate(`/sala/${roomCode}`),
        role,
        token
      ),
    [navigate, role, userID, token]
  );

  const handleLevelChange = useCallback((value: string) => {
    setSelectedLevel(value);
    setPage(1);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando salas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="div-salas-todas-las-partidas">
      {/* Header */}
      <div className="header-salas-todas-las-partidas flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold">Todas las Partidas</h3>

        <div className="flex items-center gap-2 mr-4">
          <LevelSelect value={selectedLevel} onChange={handleLevelChange} />
        </div>
      </div>

      {/* Tabla */}
      <div className="w-full table-wrapper" style={{ height: "calc(100vh - 300px)", overflow: "visible" }}>
        <MuiTable
          columns={columns}
          rows={tableRows}
          pageSize={limit}
          totalItems={filteredRooms.length}
          limit={limit}
          setPage={setPage}
          page={page}
          showExport={false}
          autoHeight={true} 
        />
      </div>
    </div>
  );
}
