'use client';

import { useConfigLogic } from '@/hooks/config/useConfigLogic';
import { isProducts } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import Link from 'next/link';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { HiMenu } from 'react-icons/hi';
import { IoHome, IoReloadOutline } from 'react-icons/io5';
import Drawer from './Drawer'; // Restauramos la importación del Drawer
import { SearchProductModal } from './modal/SearchProductModal';
import { ProductDetailsGetModal } from './products/ProductDetailsGetModal';

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Estado para el Drawer
  const { user, client, tenant, invoiceExist } = useConfigStore();
  const { configFailed } = useConfigLogic();
  const { modals, closeModal, openModal } = useModalStore();
  const redirect = isProducts(tenant?.system) ? "/orders/products" : "/orders/restaurant";

  return (
    <>
      <nav className="bg-primary px-2 py-1.5 sm:p-2 text-text-inverted shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center px-2 sm:px-4">

         <div className="flex items-center">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-text-inverted hover:text-secondary"
            >
              <HiMenu size={26} className="sm:w-8 sm:h-8" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-4 font-semibold text-xs sm:text-sm">
            <div className="hidden sm:block uppercase">{ user?.name }</div>
            <div className="hidden sm:block">|</div>
            <div className="truncate max-w-[160px] sm:max-w-none uppercase">{ client?.ambiente == '01' ? client?.nombre_comercial : tenant?.description }</div>
          </div>

          <div className='flex'>
            {
              invoiceExist && (
                <div className="mr-2 flex items-center">
                  <Link href="/settings/payments" title="Factura pendiente de pago — click para ver">
                    <span className="relative flex items-center justify-center clickeable">
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50 delay-150"></span>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-25 delay-300"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-white animate-pulse shadow-[0_0_10px_5px_rgba(255,255,255,0.85)]"></span>
                      </span>
                    </span>
                  </Link>
                </div>
              )
            }
            { configFailed ? (
              <button onClick={() => window.location.reload()} className="text-text-inverted hover:text-secondary clickeable">
                <IoReloadOutline size={22} className="sm:w-7 sm:h-7" />
              </button>
            ) : (
              <>
                { isProducts(tenant?.system) &&
                  <BiSearch size={22} className="sm:w-7 sm:h-7 mx-4 clickeable" onClick={() => openModal('searchProductOnBar')} />
                }
                <Link href={redirect} className="text-text-inverted hover:text-secondary">
                  <IoHome size={22} className="sm:w-7 sm:h-7" />
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SearchProductModal isShow={modals.searchProductOnBar} onClose={()=>{ closeModal('searchProductOnBar')}} />
      <ProductDetailsGetModal isShow={modals.productDetailsOnNavbar} onClose={() => closeModal('productDetailsOnNavbar')} row='cod' /> 
    </>
  );
};
