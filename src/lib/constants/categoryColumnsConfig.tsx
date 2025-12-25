import type { GridColDef } from "@mui/x-data-grid";
import EditarCategoria from "@/components/categorias/editar-categoria";
import '@/components/categorias/css/styles.css';

interface Category {
  id: string;
  category: string;
  photo_category: string;
}

interface UserProfile {
  id: string;
}

interface User {
  profile: UserProfile | null;
}

export const getColumnsCategorias = (
  token: string,
  user: User | null,
  onDelete: (id: string) => void
): GridColDef<Category>[] => {
  const columns: GridColDef<Category>[] = [
    {
      field: "photo_category",
      headerName: "Imágenes",
      width: 240,
      minWidth: 240,
      maxWidth: 240,
      sortable: false,
      resizable: false,
      headerClassName: "text-[#A09F9F] font-montserrat",
      cellClassName: "py-2",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="categoria-img-container">
          <img 
            src={params.value} 
            alt={params.row.category}
            className="categoria-thumb responsive-img-category"
          />   
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Nombre",
      flex: 0.6,
      minWidth: 180,
      sortable: true,
      resizable: false,
      headerClassName: "text-[#A09F9F] font-montserrat",
      cellClassName: "text-white font-montserrat font-semibold text-base",
      renderCell: (params) => (
        <p className="font-semibold text-[16px]">{params.value}</p>
      ),
    },
    {
      field: "eliminar",
      headerName: "Eliminar",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat",
      cellClassName: "text-center",
      renderCell: (params) => (
        <div className="flex items-center justify-center">
          <img
            src="/svg/iconos/eliminar-blanco.svg"
            alt="Eliminar"
            className="cursor-pointer w-[20px] h-[20px] hover:scale-110 transition-transform"
            onClick={() => onDelete(params.row.id)}
          />
        </div>
      ),
    },
    {
      field: "editar",
      headerName: "Editar",
      width: 200,
      minWidth: 200,
      maxWidth: 200,
      sortable: false,
      resizable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-[#A09F9F] font-montserrat",
      cellClassName: "text-center",
      renderCell: (params) => (
        <div className="w-full flex items-center justify-center">
          {user && (
            <EditarCategoria
              pregunta={params.row}
              token={token}
              profile={user?.profile ?? null}
            />
          )}
        </div>
      ),
    },
  ];

  return columns;
};