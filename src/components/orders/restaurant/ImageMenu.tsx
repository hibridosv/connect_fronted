'use client';

import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import Image from 'next/image';
import { useRef } from 'react';


export interface ImageMenuI {
  record: any;
  index: number;
  imageLoader: any;
}


export function ImageMenu(props: ImageMenuI) {
  const { record, index, imageLoader } = props;
  const { sendingProductIds } = ordersStore();
  const { addNew } = useOrderRestaurantFnLogic();
  const { setElement } = useTempStorage();
  const { openModal, closeModal } = useModalStore();
  const { activeConfig } = useConfigStore();

  const pendingRef = useRef(0);
  const processingRef = useRef(false);

  const isProduct = record.icon_type == 1;
  const label = isProduct ? record?.product?.description : record?.category?.name;
  const imageSrc = isProduct ? record?.product?.restaurant?.image : record?.category?.img;
  const isSending = record.product_id !== null && sendingProductIds.includes(record.product_id);

  const sendProduct = async (productId: number) => {
    pendingRef.current += 1;
    if (processingRef.current) return;

    processingRef.current = true;
    while (pendingRef.current > 0) {
      pendingRef.current -= 1;
      await addNew(productId);
    }
    processingRef.current = false;
    dismiss();
  };

  const dismiss = () => {
    if (activeConfig && activeConfig.includes("restaurant-sales-modal-dismis-category")) {
      closeModal('categoryMenu');
    }
  };

  return (
    <div key={record?.id} className="animate-scale-in" title={label}>
      <div
        onClick={isProduct
          ? () => sendProduct(record.product_id)
          : () => { openModal('categoryMenu'); setElement("categoryMenu", record); }
        }
        className={`group relative w-[104px] overflow-hidden rounded-xl bg-bg-content shadow-md transition-all duration-100 ease-out hover:shadow-xl active:scale-95 active:shadow-md clickeable
          ${isSending ? 'scale-[0.97]' : ''}
        `}
      >
        <div className="relative h-[104px] w-[104px] overflow-hidden">
          <Image
            loader={imageLoader}
            src={imageSrc}
            alt={label || 'Icono de imagen'}
            width={104}
            height={104}
            className={`h-full w-full object-cover transition-all duration-100 group-hover:scale-110 ${isSending ? 'scale-105 brightness-90' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className={`
          flex h-10 items-center justify-center px-1.5
          transition-all duration-100
          ${isSending ? 'bg-primary/10' : isProduct
            ? 'bg-bg-subtle/80 group-hover:bg-bg-subtle'
            : 'bg-slate-300 group-hover:bg-accent/25'
          }
        `}>
          {isSending ? (
            <div className="flex items-center gap-1">
              <span className="inline-block h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDuration: '0.4s' }} />
              <span className="inline-block h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }} />
              <span className="inline-block h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDuration: '0.4s', animationDelay: '0.2s' }} />
            </div>
          ) : (
            <p className={`w-full text-center text-[12px] font-semibold uppercase leading-tight line-clamp-2 ${isProduct ? 'text-text-base' : 'text-black'}`}>
              {label}
            </p>
          )}
        </div>

        {!isProduct && (
          <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/90 shadow-sm">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
