import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@/components/UI/Table/Table/index";
import { getColumnsRanking } from "@/lib/constants/ColumnsTable/RankingColumnsConfig";
import { getAllProfilesEndpoint } from "@/lib/api/profile";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import "./css/ranking.css";

interface UserProfile {
  id: string;
  nickname: string;
  level: string;
  correct_answers: number;
  Rooms_win: number;
  Total_points: number;
}

interface RankingUser {
  id: string;
  profile: UserProfile;
  verified: boolean;
}

interface TableRankingProps {
  searchQuery?: string;
}

const TableRanking: React.FC<TableRankingProps> = ({ searchQuery = "" }) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  
  const navigate = useNavigate();
  const { logout } = useLogout();

  // Cargar token del localStorage
  useEffect(() => {
    try {
      const authResponseStr = localStorage.getItem("authResponse");
      if (authResponseStr) {
        const authResponse = JSON.parse(authResponseStr);
        setToken(authResponse.accesToken);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al cargar token:", error);
      navigate("/");
    }
  }, [navigate]);

  // Función para obtener usuarios desde la API
  const getUsers = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllProfilesEndpoint(token);
      
      // Ordenar por puntos totales (descendente)
      const sortedProfiles = response.sort(
        (a: RankingUser, b: RankingUser) => 
          (b.profile?.Total_points || 0) - (a.profile?.Total_points || 0)
      );
      
      setUsers(sortedProfiles);
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);

      // Manejar token expirado
      if (error.response?.data?.message === "Token expirado") {
        await showAlert(
          "Inicio de sesión expirado",
          "Vuelve a ingresar a la plataforma",
          "error"
        );
        logout();
        return;
      }

      // Error genérico
      showAlert(
        "Error",
        "Estamos teniendo fallas técnicas al cargar el ranking",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios cuando el token esté disponible
  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  // Filtrar usuarios por búsqueda
  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.profile?.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Obtener columnas
  const columns = getColumnsRanking();

  // Mostrar loader mientras carga

  // Mostrar mensaje si no hay usuarios
  if (users.length === 0 && !loading) {
    return (
      <div className="table-usuarios">
        <div className="ranking-table-wrapper">
          <div className="flex justify-center items-center py-10">
            <p className="text-white text-lg">No hay usuarios en el ranking</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-usuarios">
      <div className="ranking-table-wrapper">
        <Table
          className="ranking-datagrid"
          columns={columns}
          rows={filteredUsers as unknown as any[]}
          pageSize={limit}
          limit={limit}
          totalItems={filteredUsers.length}
          setPage={setPage}
          page={page}
          showExport={false}
          enableFiltering={false}
        />
      </div>
    </div>
  );
};

export default TableRanking;