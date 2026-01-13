import type { GridColDef } from "@mui/x-data-grid";
import Unreport from "@/components/questionBank/report";
import Delete from "@/components/questionBank/Delete";
import Aprobar from "@/components/questionBank/Aproved";
import Desaprobar from "@/components/questionBank/Unaproved";
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
  // Datos completos para los componentes
  fullQuestion: Question;
}

export const getColumnsBanco = (
  userRole: string,
  userId: string | number,
  token: string,
  user: any,
  setUpdate: () => void,
  onFilterChange?: (estado: string) => void,
  filterAprove?: boolean | null,
  filterReport?: boolean,
  enableFiltering: boolean = false
): GridColDef<QuestionRow>[] => {
  const columns: GridColDef<QuestionRow>[] = [
    // Categoría
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
    // Pregunta
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
    // Respuestas
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
    // Aprobar/Desaprobar
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
            onClick={() => onFilterChange && onFilterChange("aprobado")}
          >
            {userRole === "ADMIN" ? "Aprobar" : "Aprobar"}
          </p>
          <p
            className={`w-min ${
              filterAprove === false ? "text-[#fff]" : "text-[#A09F9F]"
            } hover:text-white cursor-pointer lg:text-[16px] sm:text-[12px] flex items-center gap-2 text-aprobar arrow`}
            onClick={() => onFilterChange && onFilterChange("rechazado")}
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
            />
          );
        } else if (params.row.IsAproved === true) {
          return (
            <Desaprobar
              setUpdate={setUpdate}
              question={params.row.fullQuestion}
              token={token}
            />
          );
        } else {
          return (
            <Aprobar
              setUpdate={setUpdate}
              question={params.row.fullQuestion}
              token={token}
            />
          );
        }
      },
    },
    // Ignorar/Eliminar
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
          onClick={() => onFilterChange && onFilterChange("reportado")}
        >
          {userRole === "ADMIN" ? "Ignorar / Eliminar" : "Eliminar"}
          <SortArrowIcon active={!filterReport} />
        </p>
      ),
      renderCell: (params) => (
  <div className="flex gap-2">
    {params.row.isReported && userRole === "ADMIN" && (
      <Unreport 
        question={params.row.fullQuestion}  // ← Directo
        token={token} 
      />
    )}
    {(params.row.author?.id === userId || userRole === "ADMIN") && (
      <Delete 
        question={params.row.fullQuestion}  // ← Directo
        token={token} 
      />
    )}
  </div>
),
    },
    // Editar
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
        // Renderizar botón de editar solo si el usuario es autor o admin
        if (params.row.author?.id === userId || userRole === "ADMIN") {
          // `Editar` espera la prop `pregunta` con la forma { pregunta: ... }
          return (
            <Editar
              pregunta={{ pregunta: params.row.fullQuestion }}
              token={token}
              profile={user}
            />
          );
        }
        return null;
      },
    },
  ];

  return columns;
};