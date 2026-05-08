import transferRequestStore from '@/stores/transfers/transferRequestStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';

export const useTransferRequestLogic = () => {
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
    cancelTransfer,
    sendRequest,
    updateTransferStatus,
    getProductsOnline,
    acceptRequest,
  } = transferRequestStore();

  const { getElement, clearElement } = useTempStorage();
  const productSearched = getElement('productSearched');

  useEffect(() => {
    loadTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectBranch = async (record: any) => {
    const data = {
      from_tenant_id: record.to_tenant_id,
      to_tenant_id: record.from.id,
      request_at: true,
      request_by: true,
      status: 6,
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
      requested: quantity,
      quantity,
      status: 1,
    };

    const success = await addProduct(data);
    if (success) {
      clearElement('productSearched');
    }
    return success;
  };

  const handleRowClick = (record: any, tenant: any) => {
    if ((record.status === 6 && record.to_tenant_id === tenant) ||
        (record.status === 7 && record.from_tenant_id === tenant)) {
      acceptRequest(record.id);
    } else if (record.status === 8 && record.from_tenant_id === tenant) {
      updateTransferStatus(record.id, 6);
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
    handleRowClick,
    deleteProduct,
    cancelTransfer,
    sendRequest,
    getProductsOnline,
  };
};
