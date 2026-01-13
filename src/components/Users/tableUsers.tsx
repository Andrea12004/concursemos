import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Table from "@/components/UI/Table/Table/index";
import { getColumnsUsuarios } from "@/lib/constants/ColumnsTable/UserColumnsConfig";
import { getAllProfilesEndpoint } from "@/lib/api/profile";
import { createManualPaymentEndpoint, confirmPaymentEndpoint } from "@/lib/api/pay";
import { updateUserVerificationEndpoint } from "@/lib/api/users";
import { showAlert, showConfirm } from "@/lib/utils/showAlert";
import { useLogout } from "@/lib/hooks/useLogout";
import type { User } from "@/lib/types/user";
import "./css/userTable.css";

interface TableUsersProps {
  searchQuery: string;
}

export const TableUsers: React.FC<TableUsersProps> = ({ searchQuery }) => {
  const [token, setToken] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;
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

  // Función para obtener usuarios
  const getUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await getAllProfilesEndpoint(token);
      setUsers(response);
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

      showAlert(
        "Error",
        "Estamos teniendo fallas técnicas al cargar los usuarios",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Cargar usuarios cuando el token esté disponible
  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token, getUsers]);

  // Función para actualizar pago
  const actualizarPago = useCallback(
    async (id: string) => {
      if (!token) return;

      const hoy = dayjs();
      const fechaDentro30Dias = hoy.add(30, "day");

      try {
        // Crear pago manual
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

        // Confirmar pago
        await confirmarPago(id);
      } catch (error: any) {
        console.error("Error al actualizar pago:", error);

        if (error.response?.data?.message === "Token expirado") {
          await showAlert(
            "Inicio de sesión expirado",
            "Vuelve a ingresar a la plataforma",
            "error"
          );
          logout();
          return;
        }

        showAlert(
          "Error",
          "Estamos teniendo fallas técnicas al actualizar el pago",
          "error"
        );
      }
    },
    [token, logout]
  );

  // Función para confirmar pago
  const confirmarPago = useCallback(
    async (id: string) => {
      if (!token) return;

      try {
        await confirmPaymentEndpoint(id, token);

        await showAlert(
          "Operación Exitosa",
          "Se ha actualizado el estado del pago",
          "success"
        );

        // Recargar usuarios
        location.reload();
      } catch (error: any) {
        console.error("Error al confirmar pago:", error);

        if (error.response?.data?.message === "Token expirado") {
          await showAlert(
            "Inicio de sesión expirado",
            "Vuelve a ingresar a la plataforma",
            "error"
          );
          logout();
          return;
        }

        showAlert(
          "Error",
          "Estamos teniendo fallas técnicas al confirmar el pago",
          "error"
        );
      }
    },
    [token, logout]
  );

  // Handler para cambio de estado de pago
  const handleChangeEstadoPago = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (value === "Pagado") {
        actualizarPago(name);
      }
    },
    [actualizarPago]
  );

  // Función para verificar/desverificar persona
  const verifyPerson = useCallback(
    async (verified: boolean, id: string) => {
      if (!token) return;

      try {
        await updateUserVerificationEndpoint(id, !verified, token);

        await showAlert(
          "Operación Exitosa",
          `Se ha ${verified ? "quitado el estado de verificación para" : "verificado"} el usuario`,
          "success"
        );

        // Recargar usuarios
        location.reload();
      } catch (error: any) {
        console.error("Error al verificar usuario:", error);

        if (error.response?.data?.message === "Token expirado") {
          await showAlert(
            "Inicio de sesión expirado",
            "Vuelve a ingresar a la plataforma",
            "error"
          );
          logout();
          return;
        }

        showAlert(
          "Error",
          "Estamos teniendo fallas técnicas al verificar el usuario",
          "error"
        );
      }
    },
    [token, logout]
  );

  // Filtrar usuarios por búsqueda
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.profile?.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Obtener columnas
  const columns = getColumnsUsuarios(token, handleChangeEstadoPago, verifyPerson);


  // Mostrar mensaje si no hay usuarios
  if (users.length === 0 && !loading) {
    return (
      <div className="usuarios-table-wrapper">
        <div className="flex justify-center items-center py-10">
          <p className="text-white text-lg">No hay usuarios disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-table-wrapper">
      <Table
        className="usuarios-datagrid"
        columns={columns}
        rows={filteredUsers as unknown as any[]}
        pageSize={ITEMS_PER_PAGE}
        limit={ITEMS_PER_PAGE}
        totalItems={filteredUsers.length}
        setPage={setPage}
        page={page}
        showExport={false}
        enableFiltering={false}
      />
    </div>
  );
};

export default TableUsers;