import React from "react";
import Table from "@/components/UI/Table/Table/index";
import { useTableRankingLogic } from "@/lib/services/Users/useTableranking";
import "./css/ranking.css";

interface TableRankingProps {
  searchQuery?: string;
  onRefreshReady?: (refresh: () => void) => void;
}

const TableRanking: React.FC<TableRankingProps> = ({
  searchQuery = "",
  onRefreshReady,
}) => {
  const { page, setPage, limit, filteredUsers, totalUsers, columns, refreshUsers } =
    useTableRankingLogic({ searchQuery });

  // Informar al padre que refreshUsers está listo (una sola vez)
  React.useEffect(() => {
    if (onRefreshReady && refreshUsers) {
      onRefreshReady(refreshUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar
  return (
    <div className="table-usuarios">
      <div className="ranking-table-wrapper">
        <Table
          className="ranking-datagrid"
          columns={columns}
          rows={filteredUsers as unknown as any[]}
          pageSize={limit}
          limit={limit}
          totalItems={totalUsers}
          setPage={setPage}
          page={page}
          showExport={false}
          enableFiltering={false}
        />
      </div>
    </div>
  );
};

export default TableRanking;
