import type { GridColDef } from "@mui/x-data-grid";
import { Report } from "@/components/questionBank/report";
import { Delete } from "@/components/questionBank/Delete";
import { Aproved } from "@/components/questionBank/Aproved";
import { Unaproved } from "@/components/questionBank/Unaproved";
import Editar from "@/components/modals/editQuestion";
import { SortArrowIcon } from "@/components/UI/svg/SortArrowIcon";
import type { Question } from "@/lib/types/questionBank";

export interface QuestionRow {
  id: string | number;
  category: string;
  text: string;
  answers: string;
  IsAproved: boolean;
  isReported: boolean;
  author?: {
    id: string | number;
  };
  fullQuestion: Question;
}

export const getColumnsBanco = (
  userRole: string,
  userId: string | number,
  token: string,
  setUpdate: () => void,
  onFilterChange?: (estado: string) => void,
  filterAprove?: boolean | null,
  filterReport?: boolean,
): GridColDef<QuestionRow>[] => {
  
  const handleFilterClick = (estado: string) => {
    if (onFilterChange) {
      onFilterChange(estado);
    }
  };

  const columns: GridColDef<QuestionRow>[] = [
    {
      field: "category",
      headerName: "Categoría",
      flex: 1,
      minWidth: 150,
      sortable: false,
      headerClassName: "font-montserrat font-medium text-base text-[#A09F9F]",
      cellClassName: "font-montserrat font-medium text-base text-white",
      renderCell: (params) => <span className="truncate">{params.value}</span>,
    },
    {
      field: "text",
      headerName: "Pregunta",
      flex: 2,
      minWidth: 200,
      sortable: false,
      headerClassName: "font-montserrat font-medium text-base text-[#A09F9F]",
      cellClassName: "font-montserrat font-medium text-base text-white",
      renderCell: (params) => <span className="truncate">{params.value}</span>,
    },
    {
      field: "answers",
      headerName: "Respuestas",
      flex: 2,
      sortable: false,
      minWidth: 200,
      headerClassName: "font-montserrat font-medium text-base text-[#A09F9F]",
      cellClassName: "font-montserrat font-medium text-base text-white",
      renderCell: (params) => <span className="truncate">{params.value}</span>,
    },
    {
      field: "approve",
      headerName: userRole === "ADMIN" ? "Aprobar/Desaprobar" : "Aprobar",
      flex: 1.2,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "font-montserrat font-medium text-base text-[#A09F9F]",
      cellClassName: "font-montserrat font-medium text-base text-white",
      renderHeader: () => (
        <div className="flex items-center gap-3 justify-center">
          <p
            className={`w-min ${
              filterAprove === true ? "text-[#fff]" : "text-[#A09F9F]"
            } hover:text-white cursor-pointer lg:text-[16px] sm:text-[12px] flex items-center gap-2 text-aprobar arrow`}
            onClick={() => handleFilterClick("aprobado")}
          >
            {userRole === "ADMIN" ? "Aprobar" : "Aprobar"}
          </p>
          <p
            className={`w-min ${
              filterAprove === false ? "text-[#fff]" : "text-[#A09F9F]"
            } hover:text-white cursor-pointer lg:text-[16px] sm:text-[12px] flex items-center gap-2 text-aprobar arrow`}
            onClick={() => handleFilterClick("rechazado")}
          >
            {userRole === "ADMIN" ? "/Desaprobar" : "/Desaprobadas"}
            <SortArrowIcon active={filterAprove} />
          </p>
        </div>
      ),
      renderCell: (params) => {
        if (userRole === "BASIC") {
          return (
            <img
              src={`/svg/banco/${
                params.row.IsAproved === true ? "aprobado.svg" : "denegado.svg"
              }`}
              alt={params.row.IsAproved ? "Aprobado" : "Denegado"}
              className="h-6 w-6"
            />
          );
        } else if (params.row.IsAproved === true) {
          return (
            <Unaproved
              setUpdate={setUpdate}
              question={params.row.fullQuestion}
              token={token}
            />
          );
        } else {
          return (
            <Aproved
              setUpdate={setUpdate}
              question={params.row.fullQuestion}
              token={token}
            />
          );
        }
      },
    },
    {
      field: "delete",
      headerName: userRole === "ADMIN" ? "Ignorar / Eliminar" : "Eliminar",
      flex: 1.2,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "font-montserrat font-medium text-base text-[#A09F9F]",
      cellClassName: "font-montserrat font-medium text-base text-white",
      renderHeader: () => (
        <p
          className={`reportada ${
            filterReport === true ? "!text-[#fff]" : "text-[#A09F9F]"
          } hover:text-white cursor-pointer flex items-center gap-2 arrow`}
          onClick={() => handleFilterClick("reportado")}
        >
          {userRole === "ADMIN" ? "Ignorar / Eliminar" : "Eliminar"}
          <SortArrowIcon active={!filterReport} />
        </p>
      ),
      renderCell: (params) => (
        <div className="flex gap-2 items-center justify-center">
          {params.row.isReported === true && userRole === "ADMIN" ? (
            <Report 
              question={params.row.fullQuestion} 
              token={token}
              onIgnoreSuccess={setUpdate}
            />
          ) : null}
          {params.row.author?.id === userId || userRole === "ADMIN" ? (
            <Delete 
              question={params.row.fullQuestion} 
              token={token}
              onDeleteSuccess={setUpdate}
            />
          ) : null}
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "font-montserrat font-medium text-base",
      cellClassName: "text-center",
      renderCell: (params) => {
        if (params.row.author?.id === userId || userRole === "ADMIN") {
          return (
            <Editar
              pregunta={params.row.fullQuestion} 
              token={token}
              // profile={user}
            />
          );
        }
        return null;
      },
    },
  ];

  return columns;
};