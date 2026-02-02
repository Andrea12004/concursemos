import { useEffect, useState, useMemo, useCallback } from "react";
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
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useLogout();

  const token = useMemo(() => {
    return localStorage.getItem('authToken') ||
      localStorage.getItem('cnrsms_token') ||
      '';
  }, []);

  // ✅ Función para obtener usuarios
  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await getAllProfilesEndpoint(token);

      // Ordenar por puntos totales (descendente)
      const sortedProfiles = (response || []).sort(
        (a: RankingUser, b: RankingUser) =>
          (b.profile?.Total_points || 0) - (a.profile?.Total_points || 0)
      );

      setUsers(sortedProfiles);
      setTotalUsers(sortedProfiles.length);
      
      // ✅ Resetear página a 1 cuando cambia la búsqueda
      setPage(1);
    } catch (error: any) {
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
      setLoading(false);
    }
  }, [token, logout]);

  // ✅ Cargar usuarios al montar
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  // ✅ Función para refrescar usuarios (reutilizable desde componente padre)
  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ PREPARAR todas las filas (sin paginar)
  const allTableRows = useMemo(() => {
    return users.map((u) => ({
      ...u,
      id: u.id,
      profile: u.profile || {},
    }));
  }, [users]);

  // ✅ FILTRAR usuarios por búsqueda (todo el dataset)
  const allFilteredUsers = useMemo(() => {
    if (!searchQuery) return allTableRows;

    return allTableRows.filter(user =>
      user.profile?.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTableRows, searchQuery]);

  // ✅ Total de usuarios después del filtro
  const totalFilteredUsers = useMemo(() => {
    return allFilteredUsers.length;
  }, [allFilteredUsers]);

  // ✅ Generar columnas
  const columns = useMemo(() => getColumnsRanking(), []);

  return {
    page,
    setPage,
    limit,
    users,
    loading,
    // ✅ Pasar TODOS los usuarios filtrados (sin paginar)
    // El componente Table se encarga de la paginación
    filteredUsers: allFilteredUsers,
    totalUsers: totalFilteredUsers,
    columns,
    tableRows: allFilteredUsers,
    refreshUsers
  };
};