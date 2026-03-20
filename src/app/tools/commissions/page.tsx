'use client';

import { Button, Preset } from '@/components/button/button';
import { Pagination } from '@/components/Pagination';
import { ClientsSearch } from '@/components/search/ClientsSearch';
import { ShowClientSearched } from '@/components/search/ShowClientSearched';
import { ToasterMessage } from '@/components/toaster-message';
import { CommissionsListTable } from '@/components/tools/CommissionsListTable';
import { CommissionsProductsTable } from '@/components/tools/CommissionsProductsTable';
import { CommissionViewModal } from '@/components/tools/CommissionViewModal';
import { ViewTitle } from '@/components/ViewTitle';
import { useCommissionsLogic } from '@/hooks/tools/useCommissionsLogic';
import useModalStore from '@/stores/modalStorage';
import commissionsStore from '@/stores/tools/commissionsStore';
import useTempStorage from '@/stores/useTempStorage';

export default function Page() {

  const { modals, closeModal } = useModalStore();
  const { elements } = useTempStorage();

  const {handleCancelCommission, handleSaveCommission, handleCreateCommission, currentPage, handlePageNumber } = useCommissionsLogic();
  const { loading, saving, activeCommission, commissions, ordersCommission, assignProducts} = commissionsStore()
  const { getElement} = useTempStorage();
  const contactSelected = getElement('searchReferred');
 const selectedCount =  ordersCommission && ordersCommission.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text={activeCommission ? 'FACTURAS PENDIENTES DE PAGAR' : 'REPORTE DE COMISIONES POR CLIENTE'} />
        <div>
          {activeCommission ? (
            <CommissionsProductsTable referredId={activeCommission?.referred_id} />
          ) : (
            <>
              <CommissionsListTable records={commissions} isLoading={loading} />
              <Pagination records={commissions} handlePageNumber={handlePageNumber} />
            </>
          )}
        </div>
      </div>

      <div className="md:col-span-3">
        <ViewTitle text={activeCommission ? 'NUEVA COMISION' : 'BUSCAR CLIENTE'} />

        {activeCommission ? (
          <div className="p-4">
            <div className="w-full my-4 shadow-lg rounded-lg bg-bg-content border border-bg-subtle">
              <div className="flex justify-center pt-3 font-bold text-text-base">Facturas Pendientes</div>
              <div className="flex justify-center text-3xl pb-4 font-bold text-primary">{selectedCount}</div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                text="Cancelar"
                isFull={assignProducts === 0}
                preset={saving ? Preset.saving : Preset.close}
                onClick={handleCancelCommission}
                disabled={saving}
              />
              {selectedCount > 0 && (
                <Button
                  text="Guardar"
                  isFull
                  preset={saving ? Preset.saving : Preset.save}
                  onClick={handleSaveCommission}
                  disabled={saving || assignProducts == 0}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="p-2 md:p-4">
              <ClientsSearch param='referrals' placeholder='Buscar Referido' tempSelectedName='searchReferred' />
              <ShowClientSearched tempSelectedName='searchReferred' />

              <div>
                { contactSelected  && 
                  <div className="mx-4 mt-8 ">
                    <Button disabled={!contactSelected || saving } isFull preset={saving ? Preset.saving : Preset.primary} style="mx-2" text="AGREGAR" onClick={()=>{handleCreateCommission()}} />
                  </div> 
                  }
              </div>
          </div>
        )}
      </div>

          <CommissionViewModal isShow={modals.commissionDetail} onClose={() => closeModal('commissionDetail')} record={elements.commissionDetail} />
          <ToasterMessage />
    </div>
  );
}
