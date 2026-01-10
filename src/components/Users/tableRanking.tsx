import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/UI/Table/Table/index";
import { getColumnsRanking } from "@/lib/constants/ColumnsTable/RankingColumnsConfig";
import { MOCK_USERS_RANKING } from "@/lib/mocks/ranking";
import type { User } from "@/lib/types/user";
import "./css/ranking.css";

interface TableRankingProps {
  searchQuery?: string;
}

const TableRanking: React.FC<TableRankingProps> = ({ searchQuery = "" }) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const rows = useMemo(() => {
    if (!searchQuery) return MOCK_USERS_RANKING;
    const q = searchQuery.toLowerCase();
    return MOCK_USERS_RANKING.filter((u) =>
      (u.profile.nickname || "").toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const columns = useMemo(() => getColumnsRanking(), []);

  return (
    <div className="table-usuarios">
      <div className="ranking-table-wrapper">
        <Table
          className="ranking-datagrid"
          columns={columns}
          rows={rows as unknown as any[]}
          pageSize={limit}
          limit={limit}
          totalItems={rows.length}
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
