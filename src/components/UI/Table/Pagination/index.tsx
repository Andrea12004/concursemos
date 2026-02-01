import React from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import './css/styles.css'

interface PaginationComponentProps {
    totalRegistros?: number;
    handleNext?: (page: number) => void;
    limit: number;
    page: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({totalRegistros = 0, limit = 10, handleNext = () => {}, page = 1}) => {


    const onChange: PaginationProps['onChange'] = (page) => {
        handleNext(page);
    };

  return (
    <div className='flex justify-start items-center gap-2 mt-4'>
        <p className='poppins-14'>Total {totalRegistros} registros</p>
        <Pagination 
            current={page} 
            onChange={onChange} 
            total={totalRegistros} 
            pageSize={limit}
            showSizeChanger={false}
        />
    </div>
  )
}

export default PaginationComponent;