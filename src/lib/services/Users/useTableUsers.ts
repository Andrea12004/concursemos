import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { getColumnsUsuarios } from "@/lib/constants/ColumnsTable/UserColumnsConfig";
import { getAllProfilesEndpoint } from "@/lib/api/profile";
import { createManualPaymentEndpoint, confirmPaymentEndpoint } from "@/lib/api/pay";
import { updateUserVerificationEndpoint } from "@/lib/api/users";
import { showAlert } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import type { User } from "@/lib/types/user";

interface TableUsersLogicProps {
  searchQuery: string;
}

export const useTableUsersLogic = ({ searchQuery }: TableUsersLogicProps) => {
  const { logout } = useLogout();

  const token = useMemo(() => {
    return localStorage.getItem("authToken") ||
      localStorage.getItem("cnrsms_token") ||
      "";
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);


  const getUsers = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllProfilesEndpoint(
        token,
        searchQuery
      );
      const incoming = response.users || response || [];
      setUsers(incoming);
      setTotalUsers(response.total || 0);
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);

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

      showAlert(
        "Error",
        "No se pudieron cargar los usuarios. Intenta de nuevo.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  const actualizarPago = async (id: string) => {
    if (!token) return;

    const hoy = dayjs();
    const fechaDentro30Dias = hoy.add(30, "day");

    try {
      await createManualPaymentEndpoint(
        id,
        {
          startpay: hoy.format("YYYY-MM-DD"),
          endpay: fechaDentro30Dias.format("YYYY-MM-DD"),
          amount: 50000,
          status: true,
        },
        token
      );

      await confirmarPago(id);
    } catch (error: any) {
      console.error("Error al actualizar pago:", error);

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

      showAlert(
        "Error",
        "No se pudo actualizar el pago. Intenta de nuevo.",
        "error"
      );
    }
  };

  const confirmarPago = async (id: string) => {
    if (!token) return;

    try {
      await confirmPaymentEndpoint(id, token);

      await showAlert(
        "Éxito",
        "Pago actualizado correctamente",
        "success"
      );

      getUsers();
    } catch (error: any) {
      console.error("Error al confirmar pago:", error);

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

      showAlert(
        "Error",
        "No se pudo confirmar el pago. Intenta de nuevo.",
        "error"
      );
    }
  };

  const handleChangeEstadoPago = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (value === "Pagado") {
      actualizarPago(name);
    }
  };

  const verifyPerson = async (verified: boolean, id: string) => {
    if (!token) return;

    try {
      await updateUserVerificationEndpoint(id, !verified, token);

      await showAlert(
        "Éxito",
        `Usuario ${verified ? "desverificado" : "verificado"} correctamente`,
        "success"
      );

      getUsers();
    } catch (error: any) {
      console.error("Error al verificar usuario:", error);

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

      showAlert(
        "Error",
        "No se pudo verificar el usuario. Intenta de nuevo.",
        "error"
      );
    }
  };

  const columns = getColumnsUsuarios(token, handleChangeEstadoPago, verifyPerson);

  const tableRows = (users || []).map((u: any) => ({
    ...u,
    id: u.id,
    nickname: u.profile?.nickname,
    lastName: u.phone || u.lastName || '',
    city: u.profile?.City || '',
    level: u.profile?.level || '',
    points: u.profile?.Total_points || 0,
    lastPaymentDate: u.lastPaymentDate || null,
    verified: !!u.verified,
  }));

  return {
    page,
    setPage,
    limit,
    loading,
    filteredUsers: tableRows,
    totalUsers,
    columns,
    refreshUsers: getUsers,
    tableRows,
  };
};