import { GridFooterContainer } from '@mui/x-data-grid';
import Pagination from '@/components/UI/Table/Pagination';

const CustomFooter = ({
  totalItems,
  setPage,
  limit = 10,
  page = 1,
}: {
  onExportPage: () => void;
  onExportAll: () => void;
  totalItems: number;
  setPage: (page: number) => void;
  limit?: number;
  page?: number;
  showExport?: boolean;
}) => {
  return (
    <GridFooterContainer
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        minHeight: '52px !important',  // AGREGA ESTO
        height: '52px !important',     // AGREGA ESTO
        padding: '8px 16px !important' // AGREGA ESTO
      }}
    >
      <div>
        <Pagination
          handleNext={(page: number) => setPage(page)}
          totalRegistros={totalItems}
          limit={limit}
          page={page}
        />
      </div>
    </GridFooterContainer>
  );
};

export default CustomFooter;"& .MuiDataGrid-footerContainer"