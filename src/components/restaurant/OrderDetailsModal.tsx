'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { tableNames } from '@/components/orders/utils';
import { useRelativeTime } from '@/hooks/useRelativeTime';
import { formatDateAsDMY, formatHourAsHM } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import React, { useEffect, useState } from 'react';
import { BiFoodMenu, BiInfoCircle, BiTimeFive, BiUser } from 'react-icons/bi';
import { TbPointFilled } from 'react-icons/tb';
import { orderTypeMap, deliveryTypeMap, orderStatusModalMap } from './utils';

interface OrderDetailsModalProps {
  isShow: boolean;
  onClose: () => void;
  order: any;
}

const InfoPill = ({ label, value, className = '' }: { label: string; value: string; className?: string }) => (
  <div className={`text-xs font-semibold px-3 py-1 rounded-full ${className}`}>
    <span className="font-normal mr-1">{label}:</span>
    {value}
  </div>
);

export function OrderDetailsModal({ isShow, onClose, order }: OrderDetailsModalProps) {
  const { system } = useConfigStore();
  const relativeTime = useRelativeTime(order?.created_at);
  const [orderProducts, setOrderProducts] = useState<any[]>([]);

  useEffect(() => {
    if (order && isShow) {
      const products = order?.invoiceproducts?.length > 0
        ? order.invoiceproducts
        : order?.products?.length > 0
          ? order.products
          : [];
      setOrderProducts(products);
    }
  }, [order, isShow]);

  if (!order) return null;

  const status = orderStatusModalMap[order?.status] || { label: 'Desconocido', className: 'bg-gray-500/10 text-gray-500' };
  const clientName = order?.order_type === 2 ? tableNames(order) : order?.client?.name;

  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle={`Orden #${order?.number}`}>
      <Modal.Body>
        <div className="px-4">

          <div className="flex items-center justify-center text-red-700 mb-3 font-medium">
            <BiTimeFive className="mr-2 animate-spin" />
            <span className='text-sm'>Inicio: {formatDateAsDMY(order?.created_at)} {formatHourAsHM(order?.created_at)} </span>
            <span className='text-xs ml-3'> (Hace {relativeTime})</span>
          </div>

            <div className="flex justify-between items-centergap-2 text-text-base">
              <div className="flex items-center">
                <BiUser className="mr-2 text-text-muted" size={16} />
                <span className="font-medium">Cliente:</span>
                <span className="ml-2">{clientName || 'No especificado'}</span>
              </div>
              <div className="flex items-center">
                <BiFoodMenu className="mr-2 text-text-muted" size={16} />
                <span className="font-medium">Atendido por:</span>
                <span className="ml-2">{order?.employee?.name}</span>
              </div>

            <div />
          </div>

          <div className="relative overflow-x-auto mt-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cant</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descuento</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle/50">
                {orderProducts.map((product: any) => (
                  <React.Fragment key={product.id}>
                    <tr className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                      <td className="px-4 py-2 text-center">{product.quantity}</td>
                      <td className="px-4 py-2">{product.product}</td>
                      <td className="px-4 py-2 text-right">{numberToMoney(product.unit_price, system)}</td>
                      <td className="px-4 py-2 text-right">{numberToMoney(product.discount, system)}</td>
                      <td className="px-4 py-2 text-right font-medium">{numberToMoney(product.total, system)}</td>
                    </tr>
                    {product?.options?.length > 0 && (
                      <tr className="bg-danger/5 border-y border-bg-subtle">
                        <td colSpan={5} className="px-4 py-1">
                          {product.options.map((opt: any) => (
                            <span key={opt.id} className="flex items-center gap-1 text-text-base">
                              <TbPointFilled className="text-danger" size={12} />
                              <span>{opt?.option?.name}</span>
                            </span>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-bg-subtle">
                <tr className="text-text-base font-semibold">
                  <td colSpan={3} className="px-4 py-3 text-right">Total</td>
                  <td className="px-4 py-3 text-right">{numberToMoney(order?.discount, system)}</td>
                  <td className="px-4 py-3 text-right">{numberToMoney(order?.total, system)}</td>
                </tr>
              </tfoot>
            </table>
          </div>


          <div className="flex flex-wrap justify-center items-center gap-2 mt-4 pt-4 border-t border-bg-subtle">
            <InfoPill label="Tipo" value={orderTypeMap[order?.order_type] ?? 'N/A'} className="bg-primary/10 text-primary" />
            <InfoPill label="Entrega" value={deliveryTypeMap[order?.delivery_type]?.label ?? 'N/A'} className="bg-cyan-500/10 text-cyan-500" />
            <InfoPill label="Estado" value={status.label} className={status.className} />
          </div>

          <div className="text-center text-xs text-text-muted/80 mt-3">
            <BiInfoCircle className="inline-block mr-1 text-orange-600" />
            <span>La propina no se encuentra incluida en el total.</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}

