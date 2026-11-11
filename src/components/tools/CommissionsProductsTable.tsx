'use client';

import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { formatDate, formatHourAsHM } from '@/lib/date-formats';
import { getTotalPercentage, numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import commissionsStore from '@/stores/tools/commissionsStore';
import { useEffect, useState } from 'react';

interface CommissionsProductsTableProps {
  referredId: string;
}

export function CommissionsProductsTable({ referredId }: CommissionsProductsTableProps) {
  const { system } = useConfigStore();
  const { ordersCommission, loadOrdersCommission, toggleOrderPay, loading } = commissionsStore();
  const [localOrders, setLocalOrders] = useState<any>(null);
  const [toggling, setToggling] = useState(false);
  
  useEffect(() => {
    if (referredId) {
      loadOrdersCommission(referredId);
    }
  }, [referredId, loadOrdersCommission]);

  useEffect(() => {
    if (ordersCommission) {
      setLocalOrders(ordersCommission);
    }
  }, [ordersCommission]);

  useEffect(() => {
    if (localOrders) {
      const count = localOrders.reduce((total: number, order: any) => {
        return !hasUnpaidProducts(order?.products) ? total + 1 : total;
      }, 0);
    }
  }, [localOrders]);

  if (loading) return <SkeletonTable rows={4} columns={8} />;
  if (!localOrders || localOrders.length === 0) return <NothingHere text="No hay facturas pendientes de pago" />;


  function hasUnpaidProducts(products: any[]): boolean {
    return products?.some((p: any) => p.is_commission_payed === 0) ?? false;
  }

  function getOrderCommissionTotal(products: any[]): number {
    return products?.reduce((sum: number, p: any) => sum + getTotalPercentage(p.subtotal, p.commission), 0) ?? 0;
  }

  const handleToggle = async (orderId: string, currentlyUnpaid: boolean) => {
    const jsonCopy = JSON.parse(JSON.stringify(localOrders));
    jsonCopy.forEach((order: any) => {
      if (order.id === orderId) {
        order.products.forEach((product: any) => {
          product.is_commission_payed = product.is_commission_payed === 0 ? 2 : 0;
        });
      }
    });
    setLocalOrders(jsonCopy);

    setToggling(true);
    const success = await toggleOrderPay(orderId, referredId, currentlyUnpaid);
    if (!success) {
      loadOrdersCommission(referredId);
    }
    setToggling(false);
  };

  const listItems = localOrders.map((record: any) => {
    const isCredit = record?.credit && record?.credit?.status === 1;
    const unpaid = hasUnpaidProducts(record?.products);
    const checked = !unpaid;

    return (
      <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${isCredit ? 'bg-danger/10' : ''}`}>
        <td className="px-3 py-2 whitespace-nowrap truncate">{formatDate(record?.charged_at)} {formatHourAsHM(record?.charged_at)}</td>
        <td className="px-3 py-2 font-medium whitespace-nowrap">{record?.invoice_assigned?.name}: {record?.invoice}</td>
        <td className="px-3 py-2 whitespace-nowrap">{record?.referred?.name}</td>
        <td className="px-3 py-2 text-center">{record?.products?.length}</td>
        <td className="px-3 py-2 text-right">{numberToMoney(record?.discount ?? 0, system)}</td>
        <td className="px-3 py-2 text-right">{numberToMoney(getOrderCommissionTotal(record?.products), system)}</td>
        <td className="px-3 py-2 text-right font-medium">{numberToMoney(record?.total ?? 0, system)}</td>
        <td className="px-3 py-2 text-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              disabled={isCredit || toggling}
              onChange={() => handleToggle(record.id, unpaid)}
            />
            <div className="w-11 h-6 bg-bg-subtle rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-bg-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
          </label>
        </td>
      </tr>
    );
  });

  return (
    <div className="m-4">
      <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Factura</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Referido</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Productos</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descuento</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Comision $</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">Pagar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {listItems}
          </tbody>
        </table>
      </div>
    </div>
  );
}
