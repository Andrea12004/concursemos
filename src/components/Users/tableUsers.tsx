import React from "react";
import Table from "@/components/UI/Table/Table/index";
import { useTableUsersLogic } from "@/lib/services/Users/useTableUsers";
import "./css/userTable.css";

interface TableUsersProps {
  searchQuery: string;
  onRefreshReady?: (refresh: () => void) => void;
}

export const TableUsers: React.FC<TableUsersProps> = ({
  searchQuery,
  onRefreshReady,
}) => {
  const {
    page,
    setPage,
    limit,
    totalUsers,
    filteredUsers,
    columns,
    refreshUsers,
  } = useTableUsersLogic({ searchQuery });

 
  React.useEffect(() => {
    if (onRefreshReady && refreshUsers) {
      onRefreshReady(refreshUsers);
    }

  }, []); 
  return (
    <div className="usuarios-table-wrapper">
      <Table
        className="usuarios-datagrid"
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
  );
};

export default TableUsers;
