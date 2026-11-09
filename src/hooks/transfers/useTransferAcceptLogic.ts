import transferAcceptStore, { hasUnregistered } from '@/stores/transfers/transferAcceptStore';
import { useEffect } from 'react';

export const useTransferAcceptLogic = () => {
  const {
    transfers,
    selectedTransfer,
    loading,
    loadingDetail,
    sending,
    loadTransfers,
    loadTransfer,
    rejectProduct,
    createProductRegister,
    acceptAll,
    rejectAll,
    setSelectedTransfer,
    clearSelectedTransfer,
  } = transferAcceptStore();

  useEffect(() => {
    loadTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowTransfer = (transfer: any) => {
    // Se muestra el de la lista mientras llega el del servidor, que puede haber cambiado de estado
    setSelectedTransfer(transfer);
    loadTransfer(transfer.id);
  };

  const handleBack = () => {
    clearSelectedTransfer();
    loadTransfers();
  };

  const hasUnregisteredProducts = selectedTransfer?.products
    ? hasUnregistered(selectedTransfer.products)
    : false;

  return {
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
  };
};
