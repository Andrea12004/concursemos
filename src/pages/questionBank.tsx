// src/pages/questionBank.tsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/layout";
import MuiTable from "@/components/UI/Table/Table";
import { getColumnsBanco } from "@/lib/constants/ColumnsTable/questionBankColumnsConfig";
import { useQuestionBank } from "@/lib/services/Question/useQuestionBank";
import "@/css/questionBank.css";
import "@/css/questionBankTable.css";

export const Banco: React.FC = () => {
  // Estado de búsqueda (si viene del Header, sino usa vacío)
  const [searchQuery] = useState<string>('');
  
  // Paginación (igual que el original: 7 items por página)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  // Hook con toda la lógica
  const {
    tableRows,
    loading,
    token,
    userID,
    user,
    filterAprove,
    filterReport,
    questions,
    ordenarPorEstado,
    triggerUpdate,
  } = useQuestionBank({ searchQuery });

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
      true // enableFiltering
    );
  }, [user?.role, userID, token, user, triggerUpdate, ordenarPorEstado, filterAprove, filterReport]);


  return (
    <Layout>
      {/* Header */}
      <div className="h-[10%] flex items-center justify-between w-[98%] banco-header">
        <h3 className="h3-content-perfil !h-full flex gap-2 items-center">
          Banco de Preguntas{" "}
          <span className="textos-peques gris pt-3">({questions.length})</span>
        </h3>
        
        {user?.role === "ADMIN" && (
          <Link
            to="/categorias"
            className="w-[15%] link-categorias-movil py-1 mt-3 text-center rounded-md font-semibold bg-[#f26a2f]"
          >
            Ver Categorias
          </Link>
        )}
      </div>

      {/* Tabla */}
      <div className="content-usuarios">
        <div className="w-full banco-table-container">
          <MuiTable
            columns={columns}
            rows={tableRows}
            totalItems={tableRows.length}
            limit={itemsPerPage}
            page={currentPage}
            setPage={setCurrentPage}
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