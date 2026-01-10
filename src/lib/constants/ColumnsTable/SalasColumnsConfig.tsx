import type { GridColDef } from '@mui/x-data-grid';
import Eliminar from '@/components/rooms/deleteRooms';
import '@/components/rooms/css/styles.css'

export interface SalaRow {
  id: string;
  room_name: string;
  room_type: string;
  player_level: string;
  level_image: string;
  start_date: string;
  categories: string;
  number_questions: string;
  players_count: string;
  time_question: string;
  room_code: string;
  can_delete: boolean;
}

export const getColumnsSalas = (
  onEnterRoom: (roomCode: string) => void,
  userRole: string,
  token: string,
  enableSorting: boolean = false // Nuevo parámetro para controlar el sorting
): GridColDef<SalaRow>[] => {
  const baseColumns: GridColDef<SalaRow>[] = [
    // Nombre de la Partida
    {
      field: 'room_name',
      headerName: 'Nombre de la Partida',
      flex: 1.5,
      minWidth: 150,
      sortable: enableSorting, // Controlado dinámicamente
      headerClassName: 'td-nom-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-nom-salas-body font-montserrat font-medium text-base text-white',
      renderCell: (params) => (
        <span className="truncate">{params.value || 'Sin nombre'}</span>
      ),
    },
    // Tipo
    {
      field: 'room_type',
      headerName: 'Tipo',
      flex: 0.8,
      minWidth: 100,
      sortable: enableSorting, // Controlado dinámicamente
      headerClassName: 'td-created-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-created-salas-body font-montserrat font-medium text-base text-white',
      renderCell: (params) => (
        <span className="truncate">{params.value}</span>
      ),
    },
    // Nivel del jugador
    {
      field: 'player_level',
      headerName: 'Nivel del jugador',
      flex: 0.8,
      minWidth: 90,
      sortable: enableSorting, // Controlado dinámicamente
      headerAlign: 'center',
      headerClassName: 'td-nivel-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-nivel-salas-body font-montserrat font-medium text-base text-white',
      align: 'center',
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full">
          <img 
            src={params.row.level_image} 
            alt={params.value} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ),
    },
    // Fecha de programación
    {
      field: 'start_date',
      headerName: 'Fecha de programación',
      width: 200,
      sortable: enableSorting, // Controlado dinámicamente
      headerClassName: 'td-fecha-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-fecha-salas-body font-montserrat font-medium text-base text-white',
      renderCell: (params) => (
        <span className="truncate">{params.value}</span>
      ),
    },
    // Temas
    {
      field: 'categories',
      headerName: 'Temas',
      width: 200,
      sortable: false, // Este siempre está en false
      headerClassName: 'td-temas-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-temas-salas-body font-montserrat font-medium text-base text-white truncate',
      renderCell: (params) => (
        <span className="truncate">{params.value}</span>
      ),
    },
    // Cantidad de preguntas
    {
      field: 'number_questions',
      headerName: 'Cantidad de preguntas',
      width: 150,
      sortable: enableSorting, // Controlado dinámicamente
      headerClassName: 'td-preguntas-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-preguntas-salas-body font-montserrat font-medium text-base text-white',
      renderCell: (params) => (
        <span>{params.value}</span>
      ),
    },
    // Cantidad de jugadores
    {
      field: 'players_count',
      headerName: 'Cantidad de jugadores',
      width: 150,
      sortable: enableSorting, // Controlado dinámicamente
      headerClassName: 'td-count-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-count-salas-body font-montserrat font-medium text-base text-white',
      renderCell: (params) => {
        const [current, total] = params.value.split(' de ');
        return (
          <p className="whitespace-nowrap">
            <span>
              <strong>{current}</strong> de <strong>{total}</strong>
            </span>
          </p>
        );
      },
    },
    // Tiempo de respuesta
    {
      field: 'time_question',
      headerName: 'Tiempo de respuesta',
      width: 180,
      sortable: enableSorting, // Controlado dinámicamente
      headerClassName: 'td-response-salas font-montserrat font-medium text-base text-[#A09F9F]',
      cellClassName: 'td-response-salas-body font-montserrat font-medium text-base text-white',
      renderCell: (params) => (
        <span><strong>{params.value}</strong></span>
      ),
    },
  ];

  // Columnas de acciones
  const actionColumns: GridColDef<SalaRow>[] = [
    // Acción: Entrar a la partida
    {
      field: 'enter',
      headerName: '',
      width: 200,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'font-montserrat font-medium text-base',
      cellClassName: 'text-center',
      renderCell: (params) => (
        <div className="">
          <button
            className="border-0 rounded-[7px] bg-[#3CEBFF] text-[#25293D] font-montserrat font-extrabold text-base leading-5 py-2 px-4 w-full hover:opacity-90 transition-opacity whitespace-nowrap"
            onClick={() => onEnterRoom(params.row.room_code)}
          >
            Entrar a la partida
          </button>
        </div>
      ),
    },
    // Eliminar
    {
      field: 'delete',
      headerName: '',
      width: 100,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'font-montserrat font-medium text-base',
      cellClassName: 'cell-eliminar-sala',
      renderCell: (params) => (
        (userRole === 'ADMIN' || params.row.can_delete) ? (
          <div className="flex gap-2 items-center justify-center">
            <Eliminar id={params.row.id} token={token} />
          </div>
        ) : null
      ),
    },
  ];

  return [...baseColumns, ...actionColumns];
};