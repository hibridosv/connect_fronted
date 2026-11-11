'use client';

import useTempStorage from '@/stores/useTempStorage';
import { HiUser } from 'react-icons/hi2';

export function SplitClient() {
  const { getElement } = useTempStorage();
  const serviceType: number = getElement('serviceType');
  const clientActive = getElement('clientActive');

  if (serviceType != 2 || !clientActive) return <></>;

  return (
    <div className="px-3 pt-2">
      <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle overflow-hidden">
        <div className="flex items-center px-4 py-2">
          <div className="relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-primary text-text-inverted">
            <HiUser className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center ring-2 ring-bg-content">
              <span className="text-2xs font-bold text-text-inverted tabular-nums">{clientActive}</span>
            </div>
          </div>

          <div className="h-5 w-px bg-bg-subtle mx-3" />

          <span className="text-sm font-semibold text-text-base uppercase tracking-wide">
            Cliente activo #{clientActive}
          </span>

          <div className="ml-auto w-2 h-2 rounded-full bg-success shrink-0" />
        </div>
      </div>
    </div>
  );
}
