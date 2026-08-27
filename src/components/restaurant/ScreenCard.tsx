'use client';

import { filterProductsOrInvoiceProducts, groupProducts } from '@/hooks/restaurant/useScreenOrdersLogic';
import { useRelativeTime } from '@/hooks/useRelativeTime';
import { formatDate, formatHourAsHM } from '@/lib/date-formats';
import { BiCar, BiRestaurant, BiUser } from 'react-icons/bi';
import { FaClock } from 'react-icons/fa';
import { TbPointFilled } from 'react-icons/tb';
import { deliveryTypeMap } from './utils';

interface ScreenCardProps {
  order: any;
  activeStation: number;
  processData: (values: { order: number; product?: number; status: number; url: string }) => void;
}

export function ScreenCard({ order, activeStation, processData }: ScreenCardProps) {
  const filteredResult = filterProductsOrInvoiceProducts(order, activeStation);
  const groupedProducts = groupProducts(filteredResult);
  const time = useRelativeTime(order.created_at);

  const handleProcessOrder = () => {
    processData({ order: order?.id, status: 2, url: 'screen/order/process' });
  };

  const handleProcessProduct = (productId: number) => {
    processData({
      order: order?.id,
      product: productId,
      status: 2,
      url: 'screen/product/process',
    });
  };

  return (
    <div className="bg-bg-content shadow-lg rounded-lg overflow-hidden border border-bg-subtle flex flex-col h-full">
      {/* Card Header */}
      <div
        className="p-3 border-b border-bg-subtle cursor-pointer clickeable hover:bg-bg-subtle/30 transition-colors"
        onClick={handleProcessOrder}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-text-base">Orden #{order.number}</h3>
          {order.status === 6 && (
            <span className="status-warning text-xs font-bold px-2 py-1 rounded">ELIMINADA</span>
          )}
        </div>
        <p className="text-base font-semibold text-primary mt-1">
          {order.order_type === 2 ? order.table?.name : order.client?.name}
        </p>
        <div className="text-xs text-text-muted flex items-center mt-2">
          <FaClock size={12} className="text-danger mr-2 animate-spin" />
          <span>
            {formatDate(order.created_at)} {formatHourAsHM(order.created_at)} ({time})
          </span>
        </div>
        {order?.comment && (
          <p className="text-sm text-warning bg-warning/10 p-2 rounded-md mt-2">{order.comment}</p>
        )}
      </div>

      {/* Products List */}
      <div className="divide-y divide-bg-subtle flex-grow">
        {groupedProducts.map((product: any) => (
          <div key={product.id}>
            <div
              className="p-3 cursor-pointer clickeable hover:bg-bg-subtle/50 transition-colors"
              onClick={() => handleProcessProduct(product.id)}
            >
              <div className="flex items-center text-base font-medium text-text-base">
                <span className="font-bold text-lg mr-3">{product.quantity}x</span>
                <span className="uppercase flex-grow">{product.product}</span>
              </div>
            </div>
            {product?.options?.length > 0 && (
              <div className="bg-bg-subtle/50 px-4 py-2 border-t border-bg-subtle">
                <ul className="list-none pl-4">
                  {product.options.map((option: any) => (
                    <li key={option.id} className="flex items-center text-sm text-text-muted">
                      <TbPointFilled className="text-accent mr-2 flex-shrink-0" size={14} />
                      <span>{option?.option?.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Card Footer */}
      <div className="bg-primary text-text-inverted py-2 px-3 mt-auto">
        <ul className="list-none grid grid-cols-2 gap-x-2 text-sm">
          <li className="flex items-center overflow-hidden">
            <BiUser className="mr-2 flex-shrink-0" size={16} />
            <span className="font-medium truncate">{order.employee?.name}</span>
          </li>
          <li className="flex items-center overflow-hidden">
            {order.delivery_type === 1 ? (
              <BiRestaurant className="mr-2 flex-shrink-0" size={16} />
            ) : (
              <BiCar className="mr-2 flex-shrink-0" size={16} />
            )}
            <span className="font-medium truncate">{deliveryTypeMap[order.delivery_type]?.label ?? 'Para Llevar'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
