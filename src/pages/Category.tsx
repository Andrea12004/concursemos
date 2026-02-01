
import Table from "@/components/UI/Table/Table";
import Layout from "@/components/layout/layout";
import { useCategoriasLogic } from "@/lib/services/Categoty/useCategory";
import "@/components/Category/css/styles.css";

const Categorias = () => {
  const {
    filteredCategories,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    columns,
    setSearchQuery,
  } = useCategoriasLogic();

  return (
    <Layout setSearchQuery={setSearchQuery}>
      <div className="h-[10%] flex items-center justify-between w-[98%]">
        <h3 className="h3-content-perfil !h-full flex gap-2 items-center">
          Categorías{" "}
          <span className="textos-peques gris pt-3">
            ({filteredCategories.length})
          </span>
        </h3>
      </div>

      <div className="content-usuarios">
        <div className="banco-table-container categorias-datagrid">
          <Table
            columns={columns}
            rows={filteredCategories}
            totalItems={filteredCategories.length}
            limit={itemsPerPage}
            page={currentPage}
            setPage={setCurrentPage}
            pageSize={itemsPerPage}
            rowHeight={120}
            showExport={false}
            enableFiltering={false}
            autoHeight={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Categorias;
