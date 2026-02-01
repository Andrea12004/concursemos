import React from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { User } from "@/lib/types/user";
import DeleteUser from "@/components/Users/deleteUser";
import BlockUser from "@/components/Users/blockUser";
import EditarUser from "@/components/Users/editarUser";

export const getColumnsUsuarios = (
  token: string,
  handleChangeEstadoPago: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  verifyPerson: (verified: boolean, id: string) => void
): GridColDef<User>[] => {
  const columns: GridColDef<User>[] = [
    {
      field: "nickname",
      headerName: "Usuario",
      flex: 0.9,
      minWidth: 150,
      sortable: true,
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base",
      renderCell: (params) => {
        const isAdmin = params.row.role === "ADMIN";
        return (
          <span
            className="truncate"
            style={{ color: isAdmin ? "#FF914C" : "#fff" }}
          >
            {params.row.profile.nickname}
          </span>
        );
      },
    },
    {
      field: "lastName",
      headerName: "Teléfono",
      flex: 0.9,
      minWidth: 130,
      sortable: true,
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base",
      renderCell: (params) => {
        const isAdmin = params.row.role === "ADMIN";
        return (
          <span
            className="truncate"
            style={{ color: isAdmin ? "#FF914C" : "#fff" }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "city",
      headerName: "Ciudad o País",
      flex: 0.9,
      minWidth: 140,
      sortable: true,
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base",
      renderCell: (params) => {
        const isAdmin = params.row.role === "ADMIN";
        return (
          <span
            className="truncate"
            style={{ color: isAdmin ? "#FF914C" : "#fff" }}
          >
            {params.row.profile.City}
          </span>
        );
      },
    },
    {
      field: "level",
      headerName: "Nivel",
      width: 80,
      sortable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      renderCell: (params) => {
        const isAdmin = params.row.role === "ADMIN";
        return (
          <div className="w-full flex items-center justify-center">
            <img
              src={`/images/niveles/${params.row.profile.level}.png`}
              alt={`Nivel ${params.row.profile.level}`}
              className="w-[40px] h-[40px] rounded-full border-2 object-cover"
              style={{ borderColor: isAdmin ? "#FF914C" : "#fff" }}
            />
          </div>
        );
      },
    },
    {
      field: "points",
      headerName: "Puntos",
      width: 100,
      sortable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base",
      renderCell: (params) => {
        const isAdmin = params.row.role === "ADMIN";
        return (
          <span style={{ color: isAdmin ? "#FF914C" : "#fff" }}>
            {params.row.profile.Total_points}
          </span>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Estado de pago",
      width: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          <select
            className="select-blanco w-[90%] outline-none px-2 py-1 rounded-[3px] bg-[#134E9D] text-white font-montserrat text-base font-medium cursor-pointer"
            name={String(params.row.id)}
            value={params.row.lastPaymentDate ? "Pagado" : "No pagado"}
            onChange={handleChangeEstadoPago}
          >
            <option value="Pagado">Pagado</option>
            <option value="No pagado">No pagado</option>
          </select>
        </div>
      ),
    },
    {
      field: "editar",
      headerName: "Editar",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          <EditarUser item={params.row} token={token} />
        </div>
      ),
    },
    {
      field: "eliminar",
      headerName: "Eliminar",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          <DeleteUser id={String(params.row.id)} token={token} />
        </div>
      ),
    },
    {
      field: "bloquear",
      headerName: "Bloquear",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          <BlockUser user={params.row} token={token} />
        </div>
      ),
    },
    {
      field: "verified",
      headerName: "",
      width: 70,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <div className="w-full flex items-center justify-center">
          <img 
            src="/images/verfied.png" 
            className="w-[18px] h-[18px]" 
            alt="Verificado" 
          />
        </div>
      ),
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          <img
            src={
              params.row.verified
                ? "/images/verfied.png"
                : "/images/unverfied.png"
            }
            className="w-[18px] h-[18px] cursor-pointer hover:opacity-70 transition-opacity"
            alt={params.row.verified ? "Verificado" : "No verificado"}
            onClick={() => verifyPerson(params.row.verified, String(params.row.id))}
          />
        </div>
      ),
    },
  ];

  return columns;
};

export default getColumnsUsuarios;