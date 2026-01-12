// src/components/rooms/roomList.tsx
import React, { useMemo } from "react";
import MuiTable from "@/components/UI/Table/Table/index";
import { getColumnsSalas } from "@/lib/constants/ColumnsTable/SalasColumnsConfig";
import { LevelSelect } from "@/components/UI/Select/LevelSelect";
import { useRoomsList } from "@/lib/services/rooms/useRoomsList";
import "./css/table.css";
import "@/components/rooms/css/styles.css";

interface SalasListaProps {
  searchQuery: string;
}

/**
 * ============================================
 * COMPONENTE SALASLIST
 * Versión refactorizada con MuiTable
 * Mantiene la misma lógica del original
 * ============================================
 */
export function SalasLista({ searchQuery }: SalasListaProps) {
  // Usar el hook personalizado con toda la lógica
  const {
    loading,
    tableRows,
    selectedLevel,
    page,
    limit,
    totalItems,
    role,
    token,
    setPage,
    handleLevelChange,
    handleEnterRoom,
  } = useRoomsList({ searchQuery });

  // Obtener columnas configuradas
  const columns = useMemo(
    () => getColumnsSalas(handleEnterRoom, role, token),
    [handleEnterRoom, role, token]
  );

  /**
   * ============================================
   * LOADING STATE
   * ============================================
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando salas...</p>
        </div>
      </div>
    );
  }

  /**
   * ============================================
   * RENDER PRINCIPAL
   * ============================================
   */
  return (
    <div className="div-salas-todas-las-partidas">
      {/* Header con título y filtro de nivel */}
      <div className="header-salas-todas-las-partidas flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold">Todas las Partidas</h3>

        {/* Filtro de nivel - Igual que el original pero con LevelSelect */}
        <div className="flex items-center gap-2 mr-4">
          <LevelSelect value={selectedLevel} onChange={handleLevelChange} />
        </div>
      </div>

      {/* Tabla con MuiTable (reemplaza la tabla HTML original) */}
      <div
        className="w-full table-wrapper"
        style={{ height: "calc(100vh - 300px)", overflow: "visible" }}
      >
        <MuiTable
          columns={columns}
          rows={tableRows}
          pageSize={limit}
          totalItems={totalItems}
          limit={limit}
          setPage={setPage}
          page={page}
          showExport={false}
          autoHeight={true}
        />
      </div>
    </div>
  );
}