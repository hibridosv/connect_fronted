'use client';

import { ExpiredStatistics } from "@/components/products/expired/ExpiredStatistics";
import { ShowProductsExpiredTable } from "@/components/products/expired/ShowProductsExpiredTable";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { ViewTitle } from "@/components/ViewTitle";
import { useProductExpiresLogic } from "@/hooks/products/useProductsExpiresLogic";
import useModalStore from "@/stores/modalStorage";
import useStateStore from "@/stores/stateStorage";
import useTempStorage from "@/stores/useTempStorage";

export default function Page() {
  const { productsExpired, expired } = useProductExpiresLogic();
  const { loading } = useStateStore();
  const isLoading = loading["Expirations"] ? true : false;
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Proximos Vencimientos" />
        <ShowProductsExpiredTable records={productsExpired} isLoading={isLoading} />
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Detalles" />
        <ExpiredStatistics statics={expired} isLoading={isLoading} />
    </div> 
    <ProductDetailsModal isShow={modals.productDetails} onClose={() => closeModal('productDetails')} record={getElement("productDetails")} /> 
</div>
  );
}
