'use client';

import { useOrderRestaurantFnLogic } from '@/hooks/order/restaurant/useOrderRestaurantFnLogic';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import ordersStore from '@/stores/orders/ordersStore';
import useTempStorage from '@/stores/useTempStorage';
import Image from 'next/image';


export interface ImageMenuI {
  record: any;
  index: number;
  imageLoader: any;
}


export function ImageMenu(props:  ImageMenuI) {
  const { record, index, imageLoader } = props;
  const { sending, sendingProductId } = ordersStore();
  const { addNew } = useOrderRestaurantFnLogic();
  const { setElement } = useTempStorage();
  const { openModal, closeModal } = useModalStore();
  const { activeConfig } = useConfigStore();

  const isProduct = record.icon_type == 1;
  const label = isProduct ? record?.product?.description : record?.category?.name;
  const imageSrc = isProduct ? record?.product?.restaurant?.image : record?.category?.img;
  const isSending = sendingProductId !== null && sendingProductId === record.product_id;

const sendProduct = async(productId: number) => {
    await addNew(productId);
    dismiss();
}

const dismiss = () => {
  if (activeConfig && activeConfig.includes("restaurant-sales-modal-dismis-category")) {
    closeModal('categoryMenu');
  }
}

    return (
        <div key={record?.id} className="animate-scale-in" title={label} >
            <div onClick={isProduct ?
                (sending ? ()=>{} : () => sendProduct(record.product_id)) :
                ()=>{ openModal('categoryMenu'); setElement("categoryMenu", record) }
              }
              className={`group relative w-[104px] overflow-hidden rounded-xl bg-bg-content shadow-md transition-all duration-100 ease-out hover:shadow-xl hover:-translate-y-1 active:scale-95 active:shadow-md
                ${sending ? 'pointer-events-none' : 'clickeable'}
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
                    className={` h-full w-full object-cover transition-all duration-100 group-hover:scale-110 ${isSending ? 'scale-105 brightness-90' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* {isSending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                      <div className="h-7 w-7 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
                    </div>
                  )} */}
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
                    <p className={`w-full text-center text-[12px] font-semibold uppercase leading-tight line-clamp-2 ${isProduct ? 'text-text-base' : 'text-black'} `}>
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
    )
};
