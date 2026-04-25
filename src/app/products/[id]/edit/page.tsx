'use client'

import { Button, Preset } from "@/components/button/button";
import { AddContactModal } from "@/components/contacs/AddContactModal";
import { NothingHere } from "@/components/NothingHere";
import { ProductImageAddModal } from "@/components/products/images/ProductImageAddModal";
import { ProductImagesSection } from "@/components/products/images/ProductImagesSection";
import { MultiPriceEdit } from "@/components/products/multi-price/MultiPriceEdit";
import { ProductsCategoriesModal } from "@/components/products/new/ProductsCategoriesModal";
import { ProductLinked } from "@/components/products/ProductLinked";
import { ContactSearch } from "@/components/search/ContactSearch";
import SettingsAddBrandModal from "@/components/settings/SettingsAddBrandModal";
import SettingsAddLocationModal from "@/components/settings/SettingsAddLocationModal";
import { SkeletonProductEditForm } from "@/components/skeleton/SkeletonProductEditForm";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useProductEditLogic } from "@/hooks/products/useProductEditLogic";
import { useProductNewLogic } from "@/hooks/products/useProductNewLogic";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useProductStore from "@/stores/products/productStore";
import useStateStore from "@/stores/stateStorage";
import useTempStorage from "@/stores/useTempStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { activeConfig } = useConfigStore();
  const { subCategories, brands, quantityUnits, locations, loadingSelects } = useProductNewLogic();
  const { loading: loadingProduct, product } = useProductStore();
  const { loading } = useStateStore();
  const isSending = loading["productForm"] ? true : false;
  const { onSubmit } = useProductEditLogic(id, setValue);
  const router = useRouter();
  const { modals, closeModal, openModal } = useModalStore();
  const { setElement, clearElement } = useTempStorage();

  useEffect(() => {
    if (product?.provider) {
      setElement('productEditProvider', product.provider);
    }
    return () => clearElement('productEditProvider');
  // eslint-disable-next-line
  }, [product]);
  const isLoading = loadingProduct || loadingSelects;

  if (!product && !loadingProduct) {
    return <NothingHere text="Producto no encontrado." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-5 md:border-r md:border-primary">
          <ViewTitle text="Editar Producto" />

          <div className="w-full px-4">
            { isLoading && <SkeletonProductEditForm /> }
            <form onSubmit={handleSubmit(onSubmit)} className={`w-full ${isLoading ? 'hidden' : ''}`}>
  
              <div className="flex flex-wrap -mx-3 mb-6">

              <input type="hidden" {...register("product_type")} />

              <div className="w-full px-3 mb-2">
                <label htmlFor="cod" className="input-label">Codigo</label>
                <input type="text" readOnly id="cod" {...register("cod", { required: true })} className="input-disabled" />
              </div>

              <div className="w-full px-3 mb-2">
                <label htmlFor="description" className="input-label">Descripción</label>
                <input type="text" id="description" {...register("description", { required: true })} className="input" />
              </div>
              { product && product.product_type == 1 && (<>
              <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="quantity" className="input-label">Cantidad</label>
                <input type="number" readOnly id="quantity" {...register("quantity", { required: true })} className="input-disabled" />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="minimum_stock" className="input-label">Minimo de Stock</label>
                <input type="number" id="minimum_stock" {...register("minimum_stock", { required: true, min: 0 })} className="input" />
              </div> </>)}


              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="saved" className={"input-label"}>Gavado</label>
                <select id="saved" {...register("saved")} className="input-select"
                >
                  <option value={1}> Gravado </option>
                  <option  value={0}> Exento </option>
                </select>
              </div>
              { product && product.product_type == 1 && (<>
              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="category_id" className="input-label clickeable" onClick={() => openModal('productCategories')}>Categoria (Click para agregar)</label>
                <select id="category_id" {...register("category_id")} className="input-select">
                  {subCategories && subCategories.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="quantity_unit_id" className="input-label">Unidad de Medida</label>
                <select  id="quantity_unit_id" {...register("quantity_unit_id")} className="input-select">
                  {quantityUnits && quantityUnits.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-2">
                <label className="input-label clickeable" onClick={() => { openModal('contactAdd'); setElement('isFromProducts', true) }}>Proveedor (Click para agregar)</label>
                <input type="hidden" {...register("provider_id")} />
                <ContactSearch
                  param="suppliers"
                  placeholder="Buscar Proveedor"
                  tempSelectedName="productEditProvider"
                  onSelect={(contact) => setValue('provider_id', contact.id)}
                  onClear={() => setValue('provider_id', '')}
                />
              </div>

            { activeConfig && activeConfig.includes('product-locations') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="location_id" className="input-label clickeable" onClick={() => openModal('locationAdd')} >Ubicación (Click para agregar)</label>
                <select id="location_id" {...register("location_id")} className="input-select">
                  {locations && locations.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div> )}

            { activeConfig && activeConfig.includes('product-brand') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="brand_id" className="input-label clickeable" onClick={()=>openModal('brandAdd')}>Marca (Click para agregar)</label>
                <select  id="brand_id" {...register("brand_id")} className="input-select">
                  {brands && brands.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div> )}

              { activeConfig && activeConfig.includes('product-measures') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="measure" className="input-label">Medida</label>
                <input type="text" id="measure" {...register("measure")} className="input" />
              </div> )}

              { activeConfig && activeConfig.includes('product-default-discount') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="default_discount" className="input-label">Descuento por Defecto %</label>
                <input type="number" step="any" id="default_discount" {...register("default_discount")} className="input" />
              </div> )}

              { activeConfig && activeConfig.includes('product-default-commission') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="default_commission" className="input-label">Comisión por Defecto %</label>
                <input type="number" step="any" id="default_commission" {...register("default_commission")} className="input" />
              </div> )}

            { activeConfig && activeConfig.includes('product-expires') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="expiration" className="input-label">Fecha de vencimiento</label>
                  <input type="date" id="expiration" {...register("expiration")} className="input" />
              </div> )}

              { activeConfig && activeConfig.includes('product-prescription') && (
              <div className="w-full md:w-1/3 px-3 mb-2">
              <label htmlFor="prescription" className="input-label" >Solicitar Receta </label>
              <input type="checkbox" placeholder="prescription" {...register("prescription")} />
              </div> )} </>)}

              <div className="w-full md:w-full px-3 mb-2">
              <label htmlFor="information" className="input-label" >Información </label>
              <textarea {...register("information")} rows={2} className="input w-full" />
              </div>


              </div>
  
              <div className="flex justify-center">
              <Button type="submit" disabled={isSending || isLoading} preset={isSending ? Preset.saving : Preset.save} />
              </div>
            </form>
        </div>

      </div>
      <div className="md:col-span-5">
        <ViewTitle text="Detalles" />
        <div className="w-full px-4">
          <MultiPriceEdit text="Editar Precios" productId={id} isShow={true} />   
        </div>  

        <ProductLinked record={product} isShow={true} isEditable={true} />
  
        <ProductImagesSection productId={id} />

        <div className="w-full p-4 flex justify-end">
          <Button text="Regresar" preset={Preset.back} onClick={() => router.back()} />
        </div>   
      </div> 
        <ProductsCategoriesModal isShow={modals.productCategories} onClose={() => closeModal('productCategories')} />
        <AddContactModal isShow={modals.contactAdd} onClose={()=>{closeModal('contactAdd'); clearElement('isFromProducts');}} />
        <SettingsAddBrandModal show={modals.brandAdd} onClose={() => closeModal('brandAdd')} />
        <SettingsAddLocationModal show={modals.locationAdd} onClose={() => closeModal('locationAdd')} />
        <ProductImageAddModal isShow={modals['productImageAdd'] ?? false} onClose={() => closeModal('productImageAdd')} productId={id} />
        <ToasterMessage />
    </div>
  );
}