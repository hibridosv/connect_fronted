'use client';

import { useConfigLogic } from '@/hooks/config/useConfigLogic';
import useConfigStore from '@/stores/configStore';
import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { IoReloadOutline } from 'react-icons/io5';

export const NavbarPayments = () => {
  const { user, client, invoiceExist } = useConfigStore();
  const { configFailed } = useConfigLogic();

  return (
    <nav className="bg-primary px-2 py-1.5 sm:p-2 text-text-inverted shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-2 sm:px-4">

        <div className="flex items-center">
          <div className="w-[26px] sm:w-8" />
        </div>

        <div className="flex items-center gap-1 sm:gap-4 font-semibold text-xs sm:text-sm">
          <div className="hidden sm:block">{user?.name}</div>
          <div className="hidden sm:block">|</div>
          <div className="truncate max-w-[160px] sm:max-w-none">{client?.nombre_comercial}</div>
        </div>

        <div className="flex items-center">
          {invoiceExist && (
            <div className="mr-2 flex items-center">
              <span className="relative flex items-center justify-center">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50 delay-150"></span>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-25 delay-300"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white animate-pulse shadow-[0_0_10px_5px_rgba(255,255,255,0.85)]"></span>
                </span>
              </span>
            </div>
          )}
          {configFailed && (
            <button onClick={() => window.location.reload()} className="text-text-inverted hover:text-secondary clickeable">
              <IoReloadOutline size={22} className="sm:w-7 sm:h-7" />
            </button>
          )}
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-text-inverted hover:text-secondary clickeable ml-2 group flex items-center gap-1.5">
            <FaSignOutAlt size={22} className="sm:w-[26px] sm:h-[26px] transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
        </div>

      </div>
    </nav>
  );
};
