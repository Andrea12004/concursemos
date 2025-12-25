import React, { useEffect, useState, useMemo, useCallback } from "react";
// useNavigate removed: no navigation needed in mock mode
import Swal from "sweetalert2";
// Usamos mocks/local en desarrollo, no necesitamos axios ni dayjs aquí
import Table from "@/components/UI/Table/Table/index";
import { getColumnsUsuarios} from "@/lib/constants/UserColumnsConfig";
import "./css/UserTable.css";

import type { User } from "@/lib/types/user";
import { fetchMockUsers, mockActualizarPago, mockVerifyPerson } from "@/lib/mocks/users";

interface TableUsersProps {
  searchQuery: string;
}

export const TableUsers: React.FC<TableUsersProps> = ({ searchQuery }) => {
  // no navigation required in mock mode
  const [token, setToken] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);

  const ITEMS_PER_PAGE = 10;

  // Logout no es necesario en modo mock. Si se necesita, se puede volver a activar.

  useEffect(() => {
    try {
      const authResponse = JSON.parse(
        localStorage.getItem("authResponse") || "{}"
      );
      setToken(authResponse.accesToken || "");
    } catch (error) {
      console.error("Error parsing auth response:", error);
    }
  }, []);

  const getUsers = useCallback(async (): Promise<void> => {
    try {
      // Usamos datos mock para pruebas en local
      const data = await fetchMockUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los datos de prueba",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }, []);

  useEffect(() => {
    // Cargamos datos mock al montar
    getUsers();
  }, [getUsers]);

  const actualizarPago = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updated = await mockActualizarPago(id);
        if (updated) {
          setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
          Swal.fire({
            title: "Operación Exitosa",
            text: "Se ha actualizado el estado del pago (mock)",
            icon: "success",
            confirmButtonText: "Ok",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el pago (mock)",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }, []
  );

  // confirmarPago no es necesario en modo mock

  const handleChangeEstadoPago = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      const { name, value } = e.target;

      if (value === "Pagado") {
        actualizarPago(name);
      }
    },
    [actualizarPago]
  );

  const verifyPerson = useCallback(
    async (verified: boolean, id: string): Promise<void> => {
      try {
        const updated = await mockVerifyPerson(verified, id);
        if (updated) {
          setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
          Swal.fire({
            title: "Operación Exitosa",
            text: `Se ha ${verified ? "quitado" : "agregado"} el estado de verificación (mock)`,
            icon: "success",
            confirmButtonText: "Ok",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cambiar el estado de verificación (mock)",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }, []
  );

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.profile.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const rowsWithId = useMemo(() => {
    return filteredUsers.map((user) => ({
      ...user,
      id: user.id,
    }));
  }, [filteredUsers]);

  const columns = useMemo(() => {
    return getColumnsUsuarios(token, handleChangeEstadoPago, verifyPerson);
  }, [token, handleChangeEstadoPago, verifyPerson]);

  return (
    <div className="usuarios-table-wrapper">
      <Table
        className="usuarios-datagrid"
        columns={columns}
        rows={rowsWithId}
        pageSize={ITEMS_PER_PAGE}
        limit={ITEMS_PER_PAGE}
        totalItems={filteredUsers.length}
        setPage={setPage}
        page={page}
        showExport={false}
      />
    </div>
  );
};

export default TableUsers;