'use client';

import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import { HiCheck, HiUser, HiUserPlus, HiXMark } from 'react-icons/hi2';

export function RestaurantClients( { order }: any) {
  const { getElement, setElement } = useTempStorage();
  const { addClient, removeClient } = useOrderRestaurantFnLogic();
  const { sending } = ordersStore();
  const serviceType: number = getElement('serviceType');
  const clientActive: number = getElement('clientActive');
  const selectedTable = getElement('selectedTable');

  if ((serviceType != 2 || !selectedTable)) return <></>;


  // el cliente 1 no se elimina (es el predeterminado) ni los que tienen productos
  const canRemove = (client: number) => client != 1 &&
    !order?.invoiceproducts?.some((product: any) => product?.attributes?.client == client);

const listItems = order?.attributes && JSON.parse(order?.attributes.clients)?.map((record: any, index: number) => {
    const isActive = clientActive == record;
    return (
      <div key={record} className="group clickeable animate-scale-in flex flex-col items-center gap-1.5" onClick={() => setElement('clientActive', record)} style={{ animationDelay: `${index * 50}ms` }} >
        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105
          ${isActive ? 'bg-accent/15 ring-2 ring-accent shadow-sm' : 'bg-bg-subtle/70 group-hover:bg-primary/15' }`}>
          <HiUser className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-primary'}`} />
          {isActive && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-md ring-2 ring-bg-content">
              <HiCheck className="w-3 h-3 text-white" />
            </div>
          )}
          {isActive && canRemove(record) && (
            <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full bg-danger flex items-center justify-center shadow-md ring-2 ring-bg-content ${sending ? 'opacity-50 pointer-events-none' : 'clickeable'}`}
              title="Eliminar cliente" onClick={(e) => { e.stopPropagation(); removeClient(order.id, record); }} >
              <HiXMark className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <span className={`text-[11px] font-semibold transition-colors duration-300
          ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-base'}`}>
          Cliente {record}
        </span>
      </div>
    );
  });


  const clientAlone = () => (
    <div className="animate-fade-in flex flex-col items-center gap-1.5">
      <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-accent/15 ring-2 ring-accent shadow-sm">
        <HiUser className="w-5 h-5 text-accent" />
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-md ring-2 ring-bg-content">
          <HiCheck className="w-3 h-3 text-white" />
        </div>
      </div>
      <span className="text-[11px] font-semibold text-accent">Cliente 1</span>
    </div>
  );

  // igual que "Agregar cliente a la mesa" del menu de opciones; necesita la orden creada
  const newClient = () => (
    <div className={`group animate-scale-in flex flex-col items-center gap-1.5 ${sending ? 'opacity-50 pointer-events-none' : 'clickeable'}`}
      onClick={() => addClient(order.id)} title="Agregar cliente a la mesa" >
      <div className="relative w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed border-success/60 bg-success/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-success/20">
        <HiUserPlus className="w-5 h-5 text-success" />
      </div>
      <span className="text-[11px] font-semibold text-success">Nuevo</span>
    </div>
  );

  return (
    <div className="w-full px-3 py-3 animate-fade-in">
      <div className="flex flex-wrap justify-center gap-5">
        { listItems ? listItems : clientAlone()}
        { order?.id && newClient() }
      </div>
    </div>
  );
}
