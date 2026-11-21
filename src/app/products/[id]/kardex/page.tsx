'use client'

import { Button, Preset } from "@/components/button/button";
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { NothingHere } from "@/components/NothingHere";
import { KardexDetailsModal } from "@/components/products/kardex/KardexDetailsModal";
import { ShowKardexTable } from "@/components/products/kardex/ShowKardexTable";
import { ViewTitle } from "@/components/ViewTitle";
import { useKardexLogic } from "@/hooks/products/useKardexLogic";
import { urlConstructor } from "@/lib/urlConstructor";
import useModalStore from "@/stores/modalStorage";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";
import { useParams, useRouter } from "next/navigation";


export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const { kardex, loadKardex, loading, product } = useProductStore();
  useKardexLogic(id);
  const { modals, closeModal } = useModalStore();
  const router = useRouter();
  const { getElement } = useTempStorage();


  const handleFormSubmit = async (values: DateRangeValues) => { 
      let url = urlConstructor(values, `kardex/products/${id}`)
      await loadKardex(url);
  }

  
    if (!product && !loading) {
      return <NothingHere text="Producto no encontrado." />;
    }
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
          <ViewTitle text="Kardex de Producto" />
          <ShowKardexTable product={product} kardex={kardex} />
      </div>
      <div className="md:col-span-3">
          <div className="flex justify-between">
            <ViewTitle text="Busqueda" />
          </div>
          <div className="mt-2 p-2">
            <DateRange onSubmit={handleFormSubmit} loading={loading} />
          </div>
          <div className="w-full p-4 flex justify-end">
            <Button text="Regresar" preset={Preset.back} onClick={() => router.back()} />   
          </div>  
      </div> 
      <KardexDetailsModal isShow={modals.kardexDetails} onClose={() => closeModal('kardexDetails')} record={getElement('kardexDetails')} />
    </div>
  );
}