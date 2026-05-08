import transferSendStore from '@/stores/transfers/transferSendStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';

export const useTransferSendLogic = () => {
  const {
    transfers,
    activeTransfer,
    linkedSystems,
    productsAdded,
    loading,
    sending,
    loadTransfers,
    createTransfer,
    addProduct,
    deleteProduct,
    updateProductQuantity,
    cancelTransfer,
    saveTransfer,
    sendTransfer,
    updateTransferStatus,
    getProductsOnline,
    acceptRequest,
  } = transferSendStore();

  const { getElement, clearElement } = useTempStorage();
  const productSearched = getElement('productSearched');

  useEffect(() => {
    loadTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBranch = async (record: any) => {
    const data = {
      to_tenant_id: record.to_tenant_id,
      from_tenant_id: record.from.id,
      request_at: false,
      status: 1,
    };
    await createTransfer(data);
  };

  const handleAddProduct = async (quantity: number) => {
    if (!productSearched?.id || !activeTransfer?.id) return false;

    const data = {
      transfer_id: activeTransfer.id,
      product_id: productSearched.id,
      cod: productSearched.cod,
      description: productSearched.description,
      requested_exists: 1,
      status: 1,
      quantity,
    };

    const success = await addProduct(data);
    if (success) {
      clearElement('productSearched');
    }
    return success;
  };

  const handleSave = () => {
    const status = activeTransfer?.requested_by ? 7 : 8;
    saveTransfer(status);
  };

  const handleRowClick = (record: any, tenant: any) => {
    if ((record.status === 6 && record.to_tenant_id === tenant) ||
        (record.status === 7 && record.from_tenant_id === tenant)) {
      acceptRequest(record.id);
    } else if (record.status === 8 && record.from_tenant_id === tenant) {
      updateTransferStatus(record.id, 1);
    }
  };

  return {
    transfers,
    activeTransfer,
    linkedSystems,
    productsAdded,
    productSearched,
    loading,
    sending,
    handleSelectBranch,
    handleAddProduct,
    handleSave,
    handleRowClick,
    deleteProduct,
    updateProductQuantity,
    cancelTransfer,
    sendTransfer,
    getProductsOnline,
  };
};
