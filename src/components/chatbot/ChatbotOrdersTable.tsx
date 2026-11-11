'use client';
import { NothingHere } from "@/components/NothingHere";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { isRestaurant, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { RiListRadio } from "react-icons/ri";
import { deliveryLabel, orderStatus } from "./utils";

export interface ChatbotOrdersTableI {
  records: any[];
  isLoading?: boolean;
  onShow: (id: string) => void;
}

export function ChatbotOrdersTable({ records, isLoading, onShow }: ChatbotOrdersTableI) {
  const { system, tenant } = useConfigStore();
  const restaurant = isRestaurant(tenant?.system);

  if (isLoading) return <SkeletonTable rows={5} columns={7} />;
  if (!records || records.length === 0) return <NothingHere text="No hay pedidos de WhatsApp" />;

  const listItems = records.map((record: any) => (
    <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 whitespace-nowrap text-primary text-center">{record.order_number}</td>
      <td className="px-3 py-2 text-left whitespace-nowrap font-medium">{record.client_name ?? `+${record.phone}`}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{deliveryLabel(record.delivery_type, restaurant)}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{formatDateAsDMY(record.created_at)} {formatHourAsHM(record.created_at)}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">{numberToMoney(record.total, system)}</td>
      <td className="px-3 py-2 text-center whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded text-xs ${orderStatus(record.status, restaurant).style}`}>{orderStatus(record.status, restaurant).label}</span>
      </td>
      <td className="px-3 py-2 text-center whitespace-nowrap">
        <RiListRadio size={24} title="Ver detalles" className="text-info clickeable mx-auto" onClick={() => onShow(record.id)} />
      </td>
    </tr>
  ));

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Pedido</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cliente</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Entrega</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Estado</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">OP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">{listItems}</tbody>
        </table>
      </div>
    </div>
  );
}
