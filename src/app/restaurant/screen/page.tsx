'use client';

import { NothingHere } from '@/components/NothingHere';
import { ScreenCard } from '@/components/restaurant/ScreenCard';
import { useScreenOrdersLogic } from '@/hooks/restaurant/useScreenOrdersLogic';
import SkeletonTable from '@/components/skeleton/skeleton-table';

export default function Page() {
  const { orders, loading, processData, activeStation, setActiveStation, workStations } = useScreenOrdersLogic();

  const stations: any[] = workStations ?? [];
  const hasOrders = orders && orders.length > 0;

  return (
    <div className="pb-24">
      {loading ? (
        <SkeletonTable rows={6} columns={4} />
      ) : hasOrders ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 m-4">
          {orders.map((order: any) => (
            <div key={order.id} className="mb-4 break-inside-avoid-column">
              <ScreenCard order={order} activeStation={activeStation} processData={processData} />
            </div>
          ))}
        </div>
      ) : (
        <NothingHere text="No hay comandas pendientes" />
      )}

      {stations.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-bg-content border border-bg-subtle rounded-lg shadow-xl p-2">
          {stations.map((station: any) => {
            const isActive = activeStation === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setActiveStation(station.id)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-text-inverted'
                    : 'text-text-muted hover:bg-bg-subtle/60'
                }`}
              >
                {station.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
