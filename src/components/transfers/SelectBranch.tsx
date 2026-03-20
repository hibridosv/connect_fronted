'use client';
import { NothingHere } from '@/components/NothingHere';
import { LuArrowRight, LuBuilding2 } from 'react-icons/lu';

interface SelectBranchProps {
  records: any;
  onSelect: (record: any) => void;
  loading?: boolean;
}

function SelectBranchSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3.5 w-36 bg-bg-subtle rounded" />
        <div className="h-5 w-16 bg-bg-subtle rounded-full" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-bg-content rounded-xl border border-bg-subtle">
          <div className="h-10 w-10 bg-bg-subtle rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-40 bg-bg-subtle rounded" />
            <div className="h-2.5 w-24 bg-bg-subtle rounded" />
          </div>
          <div className="h-4 w-4 bg-bg-subtle rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SelectBranch({ records, onSelect, loading }: SelectBranchProps) {
  if (loading) return <SelectBranchSkeleton />;

  if (!records || records.length === 0) return <NothingHere text="No tienes sucursales asignadas" />;

  return (
    <div className="p-4">

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Seleccionar destino
        </p>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {records.length} sucursal{records.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {records.map((record: any, index: number) => (
          <button
            key={record.id}
            onClick={() => onSelect(record)}
            className="group w-full flex items-center gap-4 px-4 py-3.5 bg-bg-content rounded-xl border border-bg-subtle hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all duration-200 text-left clickeable"
          >
            <div className="shrink-0 relative">
              <div className="w-10 h-10 rounded-lg bg-bg-subtle group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-200">
                <LuBuilding2 size={18} className="text-text-muted group-hover:text-primary transition-colors duration-200" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-bg-content border border-bg-subtle text-[9px] font-bold text-text-muted flex items-center justify-center leading-none">
                {index + 1}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text-base group-hover:text-primary transition-colors duration-200 truncate uppercase leading-tight">
                {record?.to?.description}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5 leading-tight">
                Transferir a esta sucursal
              </p>
            </div>

            <LuArrowRight
              size={16}
              className="shrink-0 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
            />
          </button>
        ))}
      </div>

    </div>
  );
}
