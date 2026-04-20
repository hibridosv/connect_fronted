'use client';

import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardDetailCards } from '@/components/dashboard/DashboardDetailCards';
import { DashboardHourlySalesChart } from '@/components/dashboard/DashboardHourlySalesChart';
import { DashboardKpiCards } from '@/components/dashboard/DashboardKpiCards';
import { KeyModal } from '@/components/dashboard/KeyModal';
import { ViewTitle } from '@/components/ViewTitle';
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
    <div className="bg-bg-base min-h-screen pb-8">
      <div className='flex justify-between'>
        <ViewTitle text="Dashboard" />
        { permission && permissionExists(permission, "code-view") &&
          <BiPlusCircle size={24} className='mx-6 mt-2 clickeable' onClick={()=> { openModal('showKeyPass')}} />
        }
      </div>

      <div className="px-3 sm:px-5 space-y-5">
        <DashboardKpiCards />
        <DashboardCharts />
        <DashboardHourlySalesChart />
        <DashboardDetailCards />
        {/* <DashboardTables /> */}
      </div>
      <KeyModal isShow={modals.showKeyPass} onClose={()=>{ closeModal('showKeyPass')}} />
    </div>
  );
}
