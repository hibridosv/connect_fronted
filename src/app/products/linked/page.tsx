'use client';

import { Pagination } from "@/components/Pagination";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { ShowLowStockStatistics } from "@/components/products/ShowLowStockStatistics";
import { ShowProductsTable } from "@/components/products/ShowProductsTable";
import { SearchInput } from "@/components/Search";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useLinkedProductsLogic } from "@/hooks/products/useLinkedProductsLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useModalStore from "@/stores/modalStorage";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";

export default function Page() {
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [sortBy, setSortBy] = useState("-cod");
  const { products, loading } = useProductStore();
  useLinkedProductsLogic(currentPage, searchTerm, sortBy);
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Productos" />
        { loading ? <SkeletonTable rows={15} columns={8} /> : <ShowProductsTable records={products?.data} setSortBy={setSortBy} sortBy={sortBy} /> }
        <Pagination records={products} handlePageNumber={handlePageNumber } />
    </div>
    <div className="md:col-span-3">
        <div className="flex justify-between">
          <ViewTitle text="Buscar Producto" />
        </div>
        <div className="mt-2 p-2">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" animating={loading} />
          <ShowLowStockStatistics />
        </div>
    </div> 
    <ProductDetailsModal isShow={modals.productDetails} onClose={() => closeModal('productDetails')} record={getElement("productDetails")} /> 
    <ToasterMessage />
</div>
  );
}
