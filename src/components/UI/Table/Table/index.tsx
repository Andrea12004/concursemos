import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { downloadExcel } from "react-export-table-to-excel";
import CustomFooter from "@/components/UI/Table/CustomFooter";

interface TableProps {
  className?: string;
  pageSize?: number;
  autoHeight?: boolean; 
  handleViewRow?: (row: any) => void;
  anotherFunction?: (row: any) => void;
  columns: any[];
  rows: any[];
  limit: number;
  totalItems: number;
  setPage: (page: number) => void;
  page: number;
  showExport?: boolean;
  enableFiltering?: boolean; 
}

const Table: React.FC<TableProps> = ({
  columns = [],
  rows = [],
  className = "",
  pageSize = 10,
  autoHeight = false,
  totalItems = 0,
  limit = 10,
  setPage = () => {},
  page = 1,
  showExport = true,
  enableFiltering = false, // Por defecto el filtrado está deshabilitado
}) => {
  const ColumnsProviders = columns;

  const handleDownloadExcelPage = () => {
    downloadExcel({
      fileName: "pagina_actual",
      sheet: "Hoja1",
      tablePayload: {
        header: ColumnsProviders?.map((col) => col.headerName || "") || [],
        body: rows,
      },
    });
  };

  const handleDownloadExcelAll = () => {
    downloadExcel({
      fileName: "todos_los_datos",
      sheet: "Hoja1",
      tablePayload: {
        header: ColumnsProviders?.map((col) => col.headerName || "") || [],
        body: rows,
      },
    });
  };

  return (
    <div className={`w-full h-full ${className}`} style={{ border: "none" }}>
      <DataGrid
        rows={rows}
        columns={ColumnsProviders || []}
        rowHeight={60}
        autoHeight={autoHeight}
        pagination
        paginationModel={{ page: page - 1, pageSize: pageSize }}
        onPaginationModelChange={(model) => {
          // MUI DataGrid trabaja con páginas en base 0; nuestro `page` es base 1
          const newPage = (model?.page ?? 0) + 1;
          setPage(newPage);
        }}
        disableColumnFilter={!enableFiltering} // Se habilita/deshabilita según la prop
        disableColumnSelector={!enableFiltering}
        disableColumnMenu={!enableFiltering} // Se habilita/deshabilita según la prop
        disableEval={true}
        disableRowSelectionOnClick
        disableColumnResize={false}
        sortingMode={enableFiltering ? "client" : undefined}
        filterMode={enableFiltering ? "client" : undefined}
        // Función para aplicar clases a las filas
        getRowClassName={(params) => {
          // Si la fila tiene isReported o _isReported en true, aplicar clase 'reported'
          if (
            params.row.isReported === true ||
            params.row._isReported === true
          ) {
            return "reported";
          }
          return "";
        }}
        localeText={{
          toolbarExport: "Exportar",
          noRowsLabel: "No hay datos para mostrar",
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} filas seleccionadas`
              : `${count.toLocaleString()} fila seleccionada`,
          footerTotalRows: "Total de filas:",
          paginationRowsPerPage: "Filas por página:",
        }}
        sx={{
  border: "none",
  "& .MuiDataGrid-columnHeaders": {
    borderBottom: "none",
    minHeight: "40px !important",
    maxHeight: "40px !important",
    padding: "0 8px",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
  },
  "& .MuiDataGrid-root, & .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle, & .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
    {
      fontFamily: "Montserrat",
      fontSize: "16px",
    },
  "& .MuiDataGrid-columnSeparator": {
    visibility: "visible",
    color: "#e0e0e0",
  },
  "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-columnSeparator": {
    visibility: "visible",
  },
  // Deshabilita el cursor pointer y el sorting cuando filtering está deshabilitado
  "& .MuiDataGrid-columnHeader": {
    cursor: enableFiltering ? "pointer" : "default",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    cursor: enableFiltering ? "pointer" : "default",
  },
  "& .MuiDataGrid-scrollbarFiller": {
    backgroundColor: "#1F2336 !important",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: "#1F2336 !important",
    display: "none !important",
  },
  "& .MuiDataGrid-footerContainer": {
      marginTop: "auto", // Hace que el footer se pegue abajo
    },
  // Controla la visibilidad de los iconos según la prop
  "& .MuiDataGrid-columnHeader .MuiDataGrid-iconButtonContainer": {
   display: enableFiltering ? "flex" : "none",
  },
}}
        slots={{
          footer: () => (
            <CustomFooter
              onExportPage={handleDownloadExcelPage}
              onExportAll={handleDownloadExcelAll}
              totalItems={totalItems}
              setPage={(page: number) => setPage(page)}
              limit={limit}
              page={page}
              showExport={showExport}
            />
          ),
        }}
      />
    </div>
  );
};

export default Table;
