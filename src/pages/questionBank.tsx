import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/layout";
import MuiTable from "@/components/UI/Table/Table";
import { getColumnsBanco } from "@/lib/constants/ColumnsTable/questionBankColumnsConfig";
import { useQuestionBank } from "@/lib/services/Question/useQuestionBank";
import "@/css/questionBank.css";
import "@/css/questionBankTable.css";

export const Banco: React.FC = () => {
  // Estado para búsqueda
  const [searchQuery] = useState<string>('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  // Usar el hook personalizado
  const {
    tableRows,
    token,
    userID,
    user,
    filterAprove,
    filterReport,
    questions,
    ordenarPorEstado,
    triggerUpdate,
    loading,
  } = useQuestionBank({ searchQuery });

  // Calcular filas paginadas
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tableRows.slice(startIndex, endIndex);
  }, [tableRows, currentPage, itemsPerPage]);

  // Obtener columnas
  const columns = useMemo(() => {
    return getColumnsBanco(
      user?.role || 'BASIC',
      userID,
      token,
      user || {},
      triggerUpdate,
      ordenarPorEstado,
      filterAprove,
      filterReport,
      true
    );
  }, [user?.role, userID, token, user, triggerUpdate, ordenarPorEstado, filterAprove, filterReport]);

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <Layout>
      <div className="h-[10%] flex items-center justify-between w-[98%] banco-header">
        <h3 className="h3-content-perfil !h-full flex gap-2 items-center">
          Banco de Preguntas{" "}
          <span className="textos-peques gris pt-3">({questions.length})</span>
        </h3>
        {user?.role === "ADMIN" ? (
          <Link
            to="/categorias"
            className="w-[15%] link-categorias-movil py-1 mt-3 text-center rounded-md font-semibold bg-[#f26a2f]"
          >
            Ver Categorias
          </Link>
        ) : null}
      </div>

      <div className="content-usuarios">
        {/* Tabla */}
        <div className="w-full banco-table-container">
          <MuiTable
            columns={columns}
            rows={paginatedRows}
            totalItems={tableRows.length}
            limit={itemsPerPage}
            page={currentPage}
            setPage={handlePageChange}
            pageSize={itemsPerPage}
            showExport={false}
            enableFiltering={false}
            autoHeight={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Banco;