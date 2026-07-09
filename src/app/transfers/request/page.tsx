'use client';
import { Button, Preset } from '@/components/button/button';
import { Pagination } from '@/components/Pagination';
import { ProductsSearch } from '@/components/search/ProductsSearch';
import { ShowProductSearched } from '@/components/search/ShowProductSearched';
import { ToasterMessage } from '@/components/toaster-message';
import { SelectBranch } from '@/components/transfers/SelectBranch';
import { TransferProductsTable } from '@/components/transfers/TransferProductsTable';
import { TransfersHistoryTable } from '@/components/transfers/TransfersHistoryTable';
import { ViewTitle } from '@/components/ViewTitle';
import { useTransferRequestLogic } from '@/hooks/transfers/useTransferRequestLogic';
import { usePagination } from '@/hooks/usePagination';
import { useForm } from 'react-hook-form';

export default function Page() {
  const { register, handleSubmit, setValue } = useForm();
  const {currentPage, handlePageNumber} = usePagination("&page=1");

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
    handleRowClick,
    deleteProduct,
    cancelTransfer,
    sendRequest,
    getProductsOnline,
  } = useTransferRequestLogic(currentPage);

  const onSubmit = async (data: any) => {
    const success = await handleAddProduct(data.quantity);
    if (success) {
      setValue('quantity', '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className={`${activeTransfer ? 'md:col-span-5' : 'md:col-span-4'} md:border-r md:border-primary`}>
        <ViewTitle text={activeTransfer ? 'Agregar Productos' : 'Nueva Solicitud'} />

        {activeTransfer ? (
          <div className="w-full px-4">
            <div className="font-semibold m-4">
              <div className="flex justify-between border-b-2 border-bg-subtle pb-2 text-text-base">
                <span>Enviar solicitud a:</span>
                <span className="uppercase">{activeTransfer?.from?.description}</span>
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

      <div className={activeTransfer ? 'md:col-span-5' : 'md:col-span-6'}>
        <ViewTitle text={activeTransfer ? 'Productos Agregados' : 'Últimas Solicitudes'} />

        {activeTransfer ? (
          <div>
            <TransferProductsTable
              products={productsAdded}
              onDelete={deleteProduct}
              onUpdateQuantity={() => {}}
              sending={sending}
              loading={loading}
              deleteActive
            />

            <div className="grid grid-cols-1 md:grid-cols-10 m-4 gap-2">
              <div className="col-span-3">
                <Button
                  isFull
                  disabled={sending}
                  preset={Preset.cancel}
                  text="Cancelar"
                  onClick={cancelTransfer}
                />
              </div>
              <div className="col-span-7">
                {productsAdded?.length > 0 && (
                  <Button
                    isFull
                    disabled={sending}
                    preset={sending ? Preset.saving : Preset.save}
                    text="Enviar solicitud"
                    onClick={sendRequest}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
          <TransfersHistoryTable
            records={transfers}
            onRowClick={handleRowClick}
            onGetProductsOnline={getProductsOnline}
            sending={sending}
            loading={loading}
          />
          <Pagination records={transfers} handlePageNumber={handlePageNumber } />
          </div>
        )}
      </div>
      <ToasterMessage />
    </div>
  );
}
