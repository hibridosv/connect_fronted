'use client';

import { ShowProductsTableLink } from "@/components/products/ShowProductsTableLink";
import { SearchInput } from "@/components/Search";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ViewTitle } from "@/components/ViewTitle";
import { useProductLogic } from "@/hooks/products/useProductsLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useProductStore from "@/stores/products/productStore";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const sortBy = "-updated_at";
  const { products, loading } = useProductStore();
  useProductLogic(currentPage, searchTerm, sortBy);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');



  const getNameOfPage = (param: string | null): string => {
    switch(param) {
      case 'kardex':
        return 'Kardex de Producto';
      case 'edit':
        return 'Editar Producto';
      case 'view':
        return 'Ver Producto';
      default:
        return 'Buscar Producto';
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
          <ViewTitle text={getNameOfPage(pageParam)} />
          <div className="p-2">
            { loading ? <SkeletonTable rows={15} columns={8} /> : <ShowProductsTableLink records={products?.data} link={pageParam} /> }
          </div>

      </div>
      <div className="md:col-span-3">
          <div className="flex justify-between">
            <ViewTitle text="Buscar Producto" />
          </div>
          <div className="mt-2 p-2">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" animating={loading} />
          </div>
      </div> 
    </div>
  );
}
