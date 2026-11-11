'use client';

import { Pagination } from '@/components/Pagination';
import { OrderDetailsModal } from '@/components/restaurant/OrderDetailsModal';
import { RestaurantOrdersTable } from '@/components/restaurant/RestaurantOrdersTable';
import { ShowTotal } from '@/components/ShowTotal';
import { ViewTitle } from '@/components/ViewTitle';
import { useRestaurantOrdersLogic } from '@/hooks/restaurant/useRestaurantOrdersLogic';
import { usePagination } from '@/hooks/usePagination';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';

export default function Page() {
  const { currentPage, handlePageNumber } = usePagination('&page=1');
  const { modals, closeModal } = useModalStore();
  const { elements } = useTempStorage();

  const { orders, loading, pendingCount, tableServiceCount, deliveryCount, } = useRestaurantOrdersLogic(currentPage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="ORDENES DEL DIA" />
        <div className="p-2 md:p-4">
          <RestaurantOrdersTable records={orders} isLoading={loading} />
          <Pagination records={orders} handlePageNumber={handlePageNumber} />
        </div>
      </div>

      <div className="md:col-span-3">
        <ViewTitle text="DATOS GENERALES" />
        <div className="p-2 md:p-4 space-y-3">
          <ShowTotal text="Ordenes Pendientes" quantity={pendingCount} number />
          <ShowTotal text="Servicio en Mesa" quantity={tableServiceCount} number />
          <ShowTotal text="Delivery" quantity={deliveryCount} number />
        </div>
      </div>

      <OrderDetailsModal isShow={modals.restaurantOrderDetail} onClose={() => closeModal('restaurantOrderDetail')} order={elements.restaurantOrderDetail}/>
    </div>
  );
}
