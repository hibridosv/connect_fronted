'use client';
import { NothingHere } from '@/components/NothingHere';
import { countByStatus, transferSummaryItems } from './utils';

interface TransferSummaryProps {
  records: any;
  loading?: boolean;
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-4 mb-4 p-4 bg-bg-content rounded-lg border border-bg-subtle text-center">
        <div className="h-8 w-12 bg-bg-subtle rounded mx-auto mb-2" />
        <div className="h-3 w-24 bg-bg-subtle rounded mx-auto" />
      </div>
      <div className="mx-4 bg-bg-content rounded-lg border border-bg-subtle divide-y divide-bg-subtle">
        {transferSummaryItems && transferSummaryItems.map((item) => (
          <div key={item.status} className="flex justify-between px-4 py-2.5">
            <div className="h-4 w-20 bg-bg-subtle rounded" />
            <div className="h-4 w-6 bg-bg-subtle rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransferSummary({ records, loading }: TransferSummaryProps) {
  if (loading) return <SummarySkeleton />;

  if (!records || records.length === 0) return <NothingHere width='120' height='120' text="No tienes transferencias"/>;

  const data = records;

  return (
    <div>
      <div className="mx-4 mb-4 p-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle text-center">
        <span className="text-3xl font-bold text-primary">{data.length}</span>
        <p className="text-xs uppercase text-text-muted font-semibold mt-1">Transferencias</p>
      </div>

      <div className="mx-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle divide-y divide-bg-subtle">
        {transferSummaryItems.map((item) => (
          <div key={item.status} className="flex justify-between px-4 py-2.5">
            <span className="text-text-muted text-sm">{item.label}</span>
            <span className="text-text-base font-semibold text-sm">{countByStatus(data, item.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
