'use client';
import { QrHistoryList } from '@/components/annexes/qr-reader/QrHistoryList';
import { QrImportSection } from '@/components/annexes/qr-reader/QrImportSection';
import { QrInvoiceView } from '@/components/annexes/qr-reader/QrInvoiceView';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">

      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Lector de facturas electrónicas" />
        <QrInvoiceView />
      </div>

      <div className="md:col-span-3 p-4 space-y-5">
        <QrImportSection />
        <QrHistoryList />
      </div>

      <ToasterMessage />
    </div>
  );
}
