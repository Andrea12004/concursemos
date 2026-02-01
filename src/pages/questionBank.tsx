

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/layout";
import MuiTable from "@/components/UI/Table/Table";
import { getColumnsBanco } from "@/lib/constants/ColumnsTable/questionBankColumnsConfig";
import { useQuestionBank } from "@/lib/services/Question/useQuestionBank";
import { useAuthData } from "@/lib/hooks/useAuthData";
import "@/css/questionBank.css";
import "@/css/questionBankTable.css";

export const Banco: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  const { user } = useAuthData();

  const {
    tableRows,
    token,
    userID,
    filterAprove,
    filterReport,
    questions,
    ordenarPorEstado,
    triggerUpdate,
  } = useQuestionBank({ searchQuery });

  

  const columns = getColumnsBanco(
    user?.role || "BASIC",
    userID,
    token,
    triggerUpdate,
    ordenarPorEstado,
    filterAprove,
    filterReport,
  );

  return (
    <Layout setSearchQuery={setSearchQuery} onReloadQuestions={triggerUpdate}>
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
