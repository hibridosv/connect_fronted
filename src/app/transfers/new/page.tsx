'use client';
import { Button, Preset } from '@/components/button/button';
import { ButtonDownloadGet } from '@/components/button/button-download-get';
import { ProductsSearch } from '@/components/search/ProductsSearch';
import { ShowProductSearched } from '@/components/search/ShowProductSearched';
import { ToasterMessage } from '@/components/toaster-message';
import { SelectBranch } from '@/components/transfers/SelectBranch';
import { TransferProductsTable } from '@/components/transfers/TransferProductsTable';
import { TransfersHistoryTable } from '@/components/transfers/TransfersHistoryTable';
import { ViewTitle } from '@/components/ViewTitle';
import { useTransferSendLogic } from '@/hooks/transfers/useTransferSendLogic';
import { useForm } from 'react-hook-form';
import { FaDownload } from 'react-icons/fa';

export default function Page() {
  const { register, handleSubmit, setValue } = useForm();

  const {
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
  } = useTransferSendLogic();

  const onSubmit = async (data: any) => {
    const success = await handleAddProduct(data.quantity);
    if (success) {
      setValue('quantity', '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className={`${activeTransfer ? 'md:col-span-5' : 'md:col-span-3'} md:border-r md:border-primary`}>
        <ViewTitle text={activeTransfer ? 'Agregar Productos' : 'Nueva Transferencia'} />

        {activeTransfer ? (
          <div className="w-full px-4">
            <div className="font-semibold m-4">
              <div className="flex justify-between border-b-2 border-bg-subtle pb-2 text-text-base">
                <span>Enviar a:</span>
                <span className="uppercase">{activeTransfer?.to?.description}</span>
              </div>
            </div>

            <div className="m-4">
              <ProductsSearch />
            </div>

            {productSearched?.id && (
              <div className="m-4">
                <ShowProductSearched />
                <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
                  <div className="mb-3">
                    <label htmlFor="quantity" className="input-label">Cantidad</label>
                    <input
                      type="number"
                      id="quantity"
                      {...register('quantity')}
                      className="input"
                      step="any"
                      min={0}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <SelectBranch records={linkedSystems} onSelect={handleSelectBranch} loading={loading} />
        )}
      </div>

      <div className={activeTransfer ? 'md:col-span-5' : 'md:col-span-7'}>
        <ViewTitle text={activeTransfer ? 'Productos Agregados' : 'Últimas Transferencias'} />

        {activeTransfer ? (
          <div>
            <TransferProductsTable
              products={productsAdded}
              onDelete={deleteProduct}
              onUpdateQuantity={updateProductQuantity}
              sending={sending}
              loading={loading}
            />

            <div className="grid grid-cols-1 md:grid-cols-10 m-4 gap-2">
              <div className="col-span-3">
                {productsAdded?.length > 0 && (
                  <Button
                    isFull
                    disabled={sending}
                    preset={Preset.save}
                    text="Guardar"
                    onClick={handleSave}
                  />
                )}
              </div>
              <div className="col-span-3">
                <Button
                  isFull
                  disabled={sending}
                  preset={Preset.danger}
                  text="Cancelar"
                  onClick={cancelTransfer}
                />
              </div>
              <div className="col-span-3">
                {productsAdded?.length > 0 && (
                  <Button
                    isFull
                    disabled={sending}
                    preset={sending ? Preset.saving : Preset.send}
                    text="Enviar"
                    onClick={sendTransfer}
                  />
                )}
              </div>
              <div className="col-span-1">
                {productsAdded?.length > 0 && (
                  <ButtonDownloadGet href={`id=${activeTransfer.id}&route=download.pdf.transfer`}>
                    <FaDownload size={22} />
                  </ButtonDownloadGet>
                )}
              </div>
            </div>
          </div>
        ) : (
          <TransfersHistoryTable
            records={transfers}
            onRowClick={handleRowClick}
            onGetProductsOnline={getProductsOnline}
            sending={sending}
            loading={loading}
          />
        )}
      </div>
      <ToasterMessage />
    </div>
  );
}
