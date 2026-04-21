'use client';
import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/Search";
import { ToasterMessage } from "@/components/toaster-message";
import { AdjustmentsDetailsModal } from "@/components/tools/AdjustmentsDetailsModal";
import { AdjustmentSetModal } from "@/components/tools/AdjustmentSetModal";
import { AdjustmentsProductsToChangeTable } from "@/components/tools/AdjustmentsProductsToChangeTable";
import { AdjustmentsTable } from "@/components/tools/AdjustmentsTable";
import { ViewTitle } from "@/components/ViewTitle";
import { useAjustmentLogic } from "@/hooks/tools/useAjustmentLogic";
import { useAjustmentProductsLogic } from "@/hooks/tools/useAjustmentProductsLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useModalStore from "@/stores/modalStorage";
import adjustStore from "@/stores/tools/adjustStore";


export default function Page() {
    const {currentPage, handlePageNumber} = usePagination("&page=1");
    const {currentPage: currentPageProducts, handlePageNumber: handlePageNumberProducts} = usePagination("&page=1");
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "name"], 500);
    const { start, end } = useAjustmentLogic(currentPage, true);
    const { sendAdjustment } = useAjustmentProductsLogic(currentPageProducts, searchTerm, true);
    const { adjustments, loading, adjustmentActive, sending, searching } = adjustStore();
    const { modals, closeModal } = useModalStore();
    const data = adjustments?.data || [];
    const products = adjustmentActive?.data || [];


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className={`${adjustmentActive ? 'md:col-span-7' : 'md:col-span-6'} md:border-r md:border-primary`}>
        <ViewTitle text="Ajustar Inventario" />
        { adjustmentActive ? 
        (<div className="p-4">
          <AdjustmentsProductsToChangeTable records={products} isLoading={loading} isSending={sending} sendAdjustment={sendAdjustment} />
          { !loading && <Pagination records={adjustmentActive} handlePageNumber={handlePageNumberProducts } /> }
        </div>) 
        : 
        (<div className="p-4">
          <AdjustmentsTable records={data} isLoading={loading} />
          { !loading && <Pagination records={adjustments} handlePageNumber={handlePageNumber } /> }
        </div>) 
        }
    </div>
    <div className={`${adjustmentActive ? 'md:col-span-3' : 'md:col-span-4'}`}>
        <ViewTitle text="Iniciar Ajuste" />

          <div className="m-4">
            { adjustmentActive ? 
            <div>
            <div className="mt-2 p-2 mb-4">
              <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar producto" animating={searching} />
            </div>
            <Button onClick={end} isFull={true} preset={loading ? Preset.saving : Preset.save} text="Finalizar ajuste de inventario" />
            </div> :
            <div>
            <div className="flex justify-center m-8">
              <Alert type={Preset.info} text="No se ha iniciado el ajuste de inventario. Con esta herramienta podrá ajustar su inventario con los datos existentes reales" />
            </div>
            <Button onClick={start} isFull={true} preset={loading ? Preset.saving : Preset.save} text="Iniciar ajuste de inventario" />
            </div>
          }
          </div>
    </div> 
    <AdjustmentsDetailsModal isShow={modals.adjustmentDetails} onClose={() => closeModal('adjustmentDetails')} />
    <AdjustmentSetModal isShow={modals.setAdjustment} onClose={() => closeModal('setAdjustment')} sending={sending} sendAdjustment={sendAdjustment} />
    <ToasterMessage />
</div>
  );
}
