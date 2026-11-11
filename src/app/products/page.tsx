'use client';
import { Spinner } from "@/components/Spinner";

import { LiComponent } from "@/components/button/LiComponent";
import { LinksList } from "@/components/button/LinkList";
import { DeleteModal } from "@/components/DeleteModal";
import { Pagination } from "@/components/Pagination";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { ShowProductsStatistics } from "@/components/products/ShowProductsStatistics";
import { ShowProductsTable } from "@/components/products/ShowProductsTable";
import { SearchInput } from "@/components/Search";
import { ViewTitle } from "@/components/ViewTitle";
import { useProductLogic } from "@/hooks/products/useProductsLogic";
import { useSetLinkLogic } from "@/hooks/products/useSetLinksLogic";
import { usePostRequest } from "@/hooks/request/usePostRequest";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { permissionExists } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";

export default function Page() {
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [sortBy, setSortBy] = useState("description");
  const { products, loading } = useProductStore();
  useProductLogic(currentPage, searchTerm, sortBy);
  const { permission } = useConfigStore();
  const links = useSetLinkLogic();
  const { postRequest, loading: loadingRequest } = usePostRequest();
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const [showConfirmPrices, setShowConfirmPrices] = useState(false);

  // Borra y recrea los precios de todos los productos con los de la casa matriz
  const updatePrices = () => {
    setShowConfirmPrices(false);
    postRequest('transactions/products/prices', {});
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Productos" />
        <div className="p-2">
          <ShowProductsTable records={products?.data} setSortBy={setSortBy} sortBy={sortBy} loading={loading} />
          <Pagination records={products} handlePageNumber={handlePageNumber } />
        </div>
    </div>
    <div className="md:col-span-3">
        <div className="flex justify-between">
          <ViewTitle text="Buscar Producto" />
        </div>
        <div className="mt-2 p-2">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" animating={loading} />
          <ShowProductsStatistics />

          { permissionExists(permission, "inventory-download") && 
              <div className="mt-2 p-2">
                <LinksList links={links} text="DESCARGAS">
                  { loadingRequest
                    ? <LiComponent text="Actualizando precios" content={<Spinner size={16} className="ml-2 inline" />} onClick={()=>{}} />
                    : <LiComponent text="Actualizar precios" onClick={() => setShowConfirmPrices(true)} /> }
                </LinksList>
              </div>
              } 
        </div>
    </div> 
    <ProductDetailsModal isShow={modals.productDetails} onClose={() => closeModal('productDetails')} record={getElement('productDetails')} />
    <DeleteModal isShow={showConfirmPrices} onClose={() => setShowConfirmPrices(false)} onDelete={updatePrices}
      header="Actualizar precios" textDelete="Sí, actualizar"
      text="Se borrarán los precios de todos los productos y se volverán a crear con los de la casa matriz. ¿Desea continuar?" />
</div>
  );
}
