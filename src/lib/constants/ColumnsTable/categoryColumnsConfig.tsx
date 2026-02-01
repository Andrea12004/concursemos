import EditarPregunta from "@/components/Category/editCategory";
import type { GridColDef } from "@mui/x-data-grid";

export const getColumnsCategorias = (
  token: string,
  confirmDelete: (id: string) => void,
  onRefreshCategories: () => void,
): GridColDef[] => {
  return [
    {
      field: "photo_category",
      headerName: "Imágenes",
      width: 280,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="categoria-img-container">
          <img
            src={params.value}
            alt={params.row.category || "Categoría"}
            className="w-[220px] h-[100px] rounded-md responsive-img-category"
          />
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Nombre",
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span
          style={{
            color: "white",
            fontFamily: "Montserrat",
            fontSize: "inherit",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "eliminar",
      headerName: "Eliminar",
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <img
          src="/svg/iconos/eliminar-blanco.svg"
          alt="Eliminar"
          className="categoria-delete-icon"
          onClick={() => confirmDelete(params.row.id)}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "editar",
      headerName: "Editar",
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <EditarPregunta
          pregunta={params.row}
          token={token}
          onSuccess={onRefreshCategories}
          // profile={profile}
        />
      ),
    },
  ];
};
