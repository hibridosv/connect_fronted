'use client'
import useModalStore from '@/stores/modalStorage';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import useTempStorage from '@/stores/useTempStorage';

export function useRestaurantMenuProductLogic() {
  const { updateProduct, updateProductStatus, updateProductWhatsapp, sending } = manageRestaurantStore();
  const { openModal } = useModalStore();
  const { setElement } = useTempStorage();

  const handleOpenFieldModal = (product: any, field: string, type: string, text: string) => {
    setElement('menuProduct', product);
    setElement('menuProductFieldData', { field, type, text });
    openModal('menuProductField');
  };

  const handleOpenCategoryModal = (product: any) => {
    setElement('menuProduct', product);
    openModal('menuProductCategory');
  };

  const handleOpenPanelModal = (product: any) => {
    setElement('menuProduct', product);
    openModal('menuProductPanel');
  };

  const handleOpenModifiersModal = (product: any) => {
    setElement('menuProduct', product);
    openModal('menuProductModifiers');
  };

  const handleOpenImageModal = (product: any) => {
    setElement('menuProduct', product);
    openModal('menuProductImage');
  };

  const handleOpenLinkedModal = (product: any) => {
    setElement('menuProduct', product);
    openModal('menuProductLinked');
  };

  const handleOpenDeleteModal = (product: any) => {
    setElement('menuProduct', product);
    openModal('menuProductDelete');
  };

  const handleToggleStatus = async (product: any) => {
    const newStatus = product.menu_order?.status === 0 ? 1 : 0;
    await updateProductStatus(product.id, newStatus);
  };

  const handleToggleWhatsapp = async (product: any) => {
    await updateProductWhatsapp(product.id, product.restaurant?.whatsapp_enabled !== 1);
  };

  const handleToggleSpecial = async (product: any) => {
    const newSpecial = product.menu_order?.special === 0 ? 1 : 0;
    await updateProduct(product.id, { field: 'special', data: newSpecial });
  };

  return {
    sending,
    handleOpenFieldModal,
    handleOpenCategoryModal,
    handleOpenPanelModal,
    handleOpenModifiersModal,
    handleOpenImageModal,
    handleOpenLinkedModal,
    handleOpenDeleteModal,
    handleToggleStatus,
    handleToggleWhatsapp,
    handleToggleSpecial,
  };
}
