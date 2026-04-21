'use client';

import { ViewTitle } from "@/components/ViewTitle";
import { Button, Preset } from "@/components/button/button";
import { AddContactModal } from "@/components/contacs/AddContactModal";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { ShowProductsNewTable } from "@/components/products/ShowProductsNewTable";
import { ProductsCategoriesModal } from "@/components/products/new/ProductsCategoriesModal";
import { ProductsLinkedModal } from "@/components/products/new/ProductsLinkedModal";
import SettingsAddBrandModal from "@/components/settings/SettingsAddBrandModal";
import SettingsAddLocationModal from "@/components/settings/SettingsAddLocationModal";
import { SkeletonProductNewForm } from "@/components/skeleton/SkeletonProductNewForm";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { ToasterMessage } from "@/components/toaster-message";
import { useProductNewLogic } from "@/hooks/products/useProductNewLogic";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import useProductStore from "@/stores/products/productStore";
import useStateStore from "@/stores/stateStorage";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";


export default function Page() {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { activeConfig } = useConfigStore();
  const { onSubmit, subCategories, brands, quantityUnits, providers: providersData, locations, products, loadingSelects } = useProductNewLogic(setValue, reset);
  const { loading: loadingProducts } = useProductStore();
  const { loading } = useStateStore();
  const isSending = loading["productForm"] ? true : false;
  const { modals, closeModal, openModal } = useModalStore();
  const lastProducts = products?.data;
  const { getElement, setElement, clearElement } = useTempStorage();
  const providers = providersData?.data;


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
        <div className="md:col-span-5 md:border-r md:border-primary">
            <ViewTitle text="Registrar nuevo Producto" />

            <div className="w-full px-4">
              { loadingSelects && <SkeletonProductNewForm /> }
              <form onSubmit={handleSubmit(onSubmit)} className={`w-full ${loadingSelects ? 'hidden' : ''}`}>
    
                <div className="flex flex-wrap -mx-3 mb-6">

                <div className="w-full px-3 mb-2">
                  <label htmlFor="product_type" className={"input-label"}>Tipo de Registro</label>
                  <select id="product_type" {...register("product_type")} className="input-select" >
                    <option value={1}> Producto </option>
                    <option  value={2}> Servicio </option>
                    <option  value={3}> Relacionado </option>
                  </select>
                </div>

                <div className="w-full px-3 mb-2">
                  <label htmlFor="cod" className="input-label">Codigo</label>
                  <input type="text" id="cod" {...register("cod", { required: true })} className="input" />
                </div>

                <div className="w-full px-3 mb-2">
                  <label htmlFor="description" className="input-label">Descripción</label>
                  <input type="text" id="description" {...register("description", { required: true })} className="input" />
                </div>
                { watch("product_type") == 1 && (<>
                <div className="w-full md:w-1/2 px-3 mb-2">
                  <label htmlFor="quantity" className="input-label">Cantidad</label>
                  <input type="number" id="quantity" {...register("quantity", { required: true, min: 0 })} className="input" />
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                  <label htmlFor="minimum_stock" className="input-label">Minimo de Stock</label>
                  <input type="number" id="minimum_stock" {...register("minimum_stock", { required: true, min: 0 })} className="input" />
                </div> </>)}


                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="unit_cost" className="input-label">Precio Costo</label>
                  <input type="number" step={"any"} id="unit_cost" {...register("unit_cost")} className="input" />
                </div>

                
                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="sale_price" className="input-label">Precio de venta</label>
                  <input type="number" step={"any"} id="sale_price" {...register("sale_price", { required: true, min: 0 })} className="input" />
                </div>

                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="saved" className={"input-label"}>Gavado</label>
                  <select id="saved" {...register("saved")} className="input-select"
                  >
                    <option value={1}> Gravado </option>
                    <option  value={0}> Exento </option>
                  </select>
                </div>
                { watch("product_type") == 1 && (<>
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
                  <select   id="quantity_unit_id" {...register("quantity_unit_id")} className="input-select">
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
                  <label htmlFor="provider_id" className="input-label clickeable" onClick={() => {openModal('contactAdd'); setElement('isFromProducts', true)}}>Proveedor (Click para agregar)</label>
                  <select id="provider_id" {...register("provider_id")} className="input-select">
                    {providers && providers.map((value: any) => {
                      return (
                        <option key={value.id} value={value.id}>
                          {value.name}
                        </option>
                      );
                    })}
                  </select>
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


                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="lot_id" className="input-label">Lote</label>
                  <input type="text" id="lot_id" {...register("lot_id")} className="input" />
                </div>

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
                <Button type="submit" disabled={isSending || loadingSelects} preset={isSending ? Preset.saving : Preset.save} />
                </div>
              </form>
          </div>

        </div>
        <div className="md:col-span-5">
            <ViewTitle text="Ultimos Productos" />
            <div className="p-2">
              { loadingProducts ? <SkeletonTable rows={15} columns={8} /> : <ShowProductsNewTable records={lastProducts?.data} /> }
            </div>
        </div> 
        <ProductsLinkedModal isShow={modals.productLinked} onClose={() => closeModal('productLinked')} product={lastProducts?.data[0]} />
        <ProductDetailsModal isShow={modals.productDetails} onClose={() => closeModal('productDetails')} record={getElement('productDetails')} /> 
        <ProductsCategoriesModal isShow={modals.productCategories} onClose={() => closeModal('productCategories')} />
        <AddContactModal isShow={modals.contactAdd} onClose={()=>{closeModal('contactAdd'); clearElement('isFromProducts');}} />
        <SettingsAddBrandModal show={modals.brandAdd} onClose={() => closeModal('brandAdd')} />
        <SettingsAddLocationModal show={modals.locationAdd} onClose={() => closeModal('locationAdd')} />
        <ToasterMessage />
    </div>
  );
}
