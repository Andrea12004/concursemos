
import type { GridColDef } from "@mui/x-data-grid";


interface UserProfile {
  id: string;
  nickname: string;
  level: string; // nombre del nivel (ej. "BALLENA", "DELFIN")
  correct_answers: number;
  Rooms_win: number;
  Total_points: number;
}

interface RankingUser {
  id: string;
  profile: UserProfile;
  verified: boolean;
}

export const getColumnsRanking = (): GridColDef<RankingUser>[] => {
  const columns: GridColDef<RankingUser>[] = [
    {
      field: "nickname",
      headerName: "Usuario",
      flex: 1.2,
      minWidth: 200,
      sortable: true,
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base text-white",
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <span className="truncate">{params.row.profile.nickname}</span>
          {params.row.verified && (
            <img
              src="/images/verfied.png"
              className="w-[18px] h-[18px]"
              alt="Verificado"
            />
          )}
        </div>
      ),
    },
    {
      field: "level",
      headerName: "Nivel",
      width: 120,
      sortable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          <img
            src={`/images/niveles/${params.row.profile.level}.png`}
            alt={`Nivel ${params.row.profile.level}`}
            className="w-[50px] h-[50px] rounded-full border-2 border-white object-cover"
          />
        </div>
      ),
    },
    {
      field: "correct_answers",
      headerName: "Preguntas Resueltas",
      width: 180,
      sortable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base text-white",
      renderCell: (params) => (
        <span>{params.row.profile.correct_answers || 0}</span>
      ),
    },
    {
      field: "rooms_win",
      headerName: "Salas Ganadas",
      width: 150,
      sortable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base text-white",
      renderCell: (params) => <span>{params.row.profile.Rooms_win || 0}</span>,
    },
    {
      field: "total_points",
      headerName: "Puntos Acumulados",
      flex: 0.8,
      minWidth: 150,
      sortable: true,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat text-base",
      cellClassName: "font-montserrat text-base text-white font-semibold",
      renderCell: (params) => (
        <span >
          {params.row.profile.Total_points || 0}
        </span>
      ),
    },
  ];

  return columns;
};

export default getColumnsRanking;
