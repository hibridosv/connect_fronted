'use client';

import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardDetailCards } from '@/components/dashboard/DashboardDetailCards';
import { DashboardHourlySalesChart } from '@/components/dashboard/DashboardHourlySalesChart';
import { DashboardKpiCards } from '@/components/dashboard/DashboardKpiCards';
import { KeyModal } from '@/components/dashboard/KeyModal';
import { usePermissionGuard } from '@/hooks/usePermissionGuard';
import { isProducts, permissionExists } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import { BiPlusCircle } from 'react-icons/bi';


export default function DashboardPage() {
    const { modals, openModal, closeModal} = useModalStore();
    const { permission, tenant } = useConfigStore();
    const redirect = isProducts(tenant?.system) ? "/orders/products" : "/orders/restaurant";
    const isUnauthorized = usePermissionGuard('dashboard', redirect);

  if (isUnauthorized) return null;

  return (
    <div className="bg-bg-base min-h-screen">

      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary px-5 sm:px-8 pt-5 pb-12">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/[0.04] blur-3xl animate-float pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-52 h-52 rounded-full bg-accent/[0.08] blur-3xl animate-float-slow pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-black text-text-inverted tracking-tight leading-none">Dashboard</h1>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-text-inverted/35 text-[10px] font-bold uppercase tracking-[0.2em]">Datos en tiempo real</span>
            </div>
          </div>
          { permission && permissionExists(permission, "code-view") &&
            <button
              onClick={() => openModal('showKeyPass')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-text-inverted text-xs font-semibold px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <BiPlusCircle size={15} />
              <span className="hidden sm:inline">Código</span>
            </button>
          }
        </div>
      </div>

      <div className="-mt-7 px-3 sm:px-5 pb-10 space-y-4">
        <DashboardKpiCards />
        <DashboardCharts />
        <DashboardHourlySalesChart />
        <DashboardDetailCards />
      </div>

      <KeyModal isShow={modals.showKeyPass} onClose={()=>{ closeModal('showKeyPass')}} />
    </div>
  );
}
