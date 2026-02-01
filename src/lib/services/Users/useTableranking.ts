import { useEffect, useState, useMemo } from "react";
import { getColumnsRanking } from "@/lib/constants/ColumnsTable/RankingColumnsConfig";
import { getAllProfilesEndpoint } from "@/lib/api/profile";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";

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

interface TableRankingLogicProps {
  searchQuery?: string;
}

export const useTableRankingLogic = ({ searchQuery = "" }: TableRankingLogicProps) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useLogout();

  const token = useMemo(() => {
    return localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      '';
  }, []);


  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const response = await getAllProfilesEndpoint(token);


        if (cancelled) return;

        // Ordenar por puntos totales (descendente)
        const sortedProfiles = (response || []).sort(
          (a: RankingUser, b: RankingUser) =>
            (b.profile?.Total_points || 0) - (a.profile?.Total_points || 0)
        );

        setUsers(sortedProfiles);
      } catch (error: any) {
        if (cancelled) return;

        console.error("Error al obtener usuarios:", error);

        // Manejar token expirado
        if (error.response?.data?.message === "Token expirado" ||
          error.response?.status === 401) {
          await showAlert(
            "Sesión Expirada",
            "Por favor, inicia sesión nuevamente",
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
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUsers();


    return () => {
      cancelled = true;
    };
  }, [token]);

  // Función para refrescar usuarios (reutilizable desde componente padre)
  const refreshUsers = () => {
    if (!token) return;

    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const response = await getAllProfilesEndpoint(token);

        if (cancelled) return;

        const sortedProfiles = (response || []).sort(
          (a: RankingUser, b: RankingUser) =>
            (b.profile?.Total_points || 0) - (a.profile?.Total_points || 0)
        );

        setUsers(sortedProfiles);
      } catch (error: any) {
        if (cancelled) return;
        console.error("Error al obtener usuarios:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    return users.filter(user =>
      user.profile?.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Preparar filas para la tabla
  const tableRows = useMemo(() => {
    return filteredUsers.map((u) => ({
      ...u,
      id: u.id,
      profile: u.profile || {},
    }));
  }, [filteredUsers]);

  const columns = useMemo(() => getColumnsRanking(), []);

  return {
    page,
    setPage,
    limit,
    users,
    loading,
    filteredUsers: tableRows,
    columns,
    tableRows,
    refreshUsers
  };
};