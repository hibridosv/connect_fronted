'use client';

import { ViewTitle } from '@/components/ViewTitle';
import { DateRange } from '@/components/button/DateRange';
import { GoldPointsTable } from '@/components/tools/GoldPointsTable';
import { GoldPointsViewModal } from '@/components/tools/GoldPointsViewModal';
import { useGoldPointsLogic } from '@/hooks/tools/useGoldPointsLogic';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';

export default function Page() {
  const { modals, closeModal } = useModalStore();
  const { elements } = useTempStorage();
  const { commissions, loading, saving, refresh, handleCreateGoldCommission } = useGoldPointsLogic();

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="REPORTE DE COMISIONES PUNTOS DE ORO" />
        <div className="p-2 md:p-4">
          <GoldPointsTable records={commissions} isLoading={loading} />
        </div>
      </div>

      <div className="md:col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />
        <div className="p-2 md:p-4">
          <DateRange onSubmit={handleCreateGoldCommission} loading={saving} />
        </div>
      </div>

      <GoldPointsViewModal
        isShow={modals.goldPointDetail}
        onClose={() => closeModal('goldPointDetail')}
        record={elements.goldPointDetail}
        onAction={refresh}
      />
    </div>
  );
}
