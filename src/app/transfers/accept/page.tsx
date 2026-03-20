'use client';
import { ToasterMessage } from '@/components/toaster-message';
import { TransferDetailsTable } from '@/components/transfers/TransferDetailsTable';
import { TransfersReceiveTable } from '@/components/transfers/TransfersReceiveTable';
import { TransferSummary } from '@/components/transfers/TransferSummary';
import { ViewTitle } from '@/components/ViewTitle';
import { useTransferAcceptLogic } from '@/hooks/transfers/useTransferAcceptLogic';

export default function Page() {
  const {
    transfers,
    selectedTransfer,
    loading,
    loadingDetail,
    sending,
    handleShowTransfer,
    handleBack,
    rejectProduct,
    createProductRegister,
    acceptAll,
    rejectAll,
    hasUnregisteredProducts,
  } = useTransferAcceptLogic();


  console.log(transfers);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-8 md:border-r md:border-primary">
        <ViewTitle text={selectedTransfer ? 'Detalles de la Transferencia' : 'Últimas Transferencias'} />

        {selectedTransfer ? (
          <TransferDetailsTable
            transfer={selectedTransfer}
            onBack={handleBack}
            onRejectProduct={rejectProduct}
            onCreateRegister={createProductRegister}
            onAcceptAll={acceptAll}
            onRejectAll={rejectAll}
            sending={sending}
            loadingDetail={loadingDetail}
            hasUnregisteredProducts={hasUnregisteredProducts}
          />
        ) : (
          <TransfersReceiveTable
            records={transfers}
            onShowTransfer={handleShowTransfer}
            loading={loading}
          />
        )}
      </div>

      <div className="md:col-span-2">
        <ViewTitle text="Transferencias" />
        <TransferSummary records={transfers} loading={loading} />
      </div>
          <ToasterMessage />
    </div>
  );
}
