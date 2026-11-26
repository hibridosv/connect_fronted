'use client'
import { getCountryProperty } from '@/lib/utils'
import { updateService } from '@/services/services'
import useConfigStore from '@/stores/configStore'
import useProductStore from '@/stores/products/productStore'
import useStateStore from '@/stores/stateStorage'
import useToastMessageStore from '@/stores/toastMessageStore'
import { useEffect } from 'react'

export function useProductEditLogic(id?: string, setValue?: any) {
const { loadProduct, product } = useProductStore();
  const { system, activeConfig } = useConfigStore();
  const hasExpiresConfig = !!activeConfig?.includes('product-expires');
  const { openLoading, closeLoading } = useStateStore();

  
  useEffect(() => {

    if (id) {
      loadProduct(`products/${id}?included=prices,category,subcategory,quantityUnit,provider,brand,location`);
    }
  }, [loadProduct, id]);


    useEffect(() => {
      setValue("cod", product?.cod)
      setValue("description", product?.description)
      setValue("quantity", product?.quantity)
      setValue("minimum_stock", product?.minimum_stock)
      setValue("category_id", product?.category_id)
      setValue("quantity_unit_id", product?.quantity_unit_id)
      setValue("provider_id", product?.provider_id)
      setValue("brand_id", product?.brand_id)
      setValue("location_id", product?.location_id)
      setValue("measure", product?.measure)
      setValue("default_discount", product?.default_discount)
      setValue("default_commission", product?.default_commission)
      setValue("prescription", product?.prescription)
      if (hasExpiresConfig) setValue("expires", product?.expires == 1)
      setValue("saved", product?.saved)
      setValue("unit_cost", product?.unit_cost)

      // eslint-disable-next-line
    }, [product, setValue, hasExpiresConfig])


  const onSubmit = async (formData: any) => {
    openLoading("productForm");
      // el codigo, el stock y el tipo no se editan aqui; el costo solo en servicios
      const { cod, quantity, product_type, ...data } = formData;
      if (product?.product_type != 2) delete data.unit_cost;
      if (product?.product_type != 1) data.minimum_stock = 1;
      // el checkbox solo existe con la config product-expires y en productos (tipo 1); sin ella no se toca el valor del producto
      if (hasExpiresConfig && product?.product_type == 1) data.expires = data.expires ? 1 : 0; else delete data.expires;
    data.taxes = getCountryProperty(parseInt(system?.country)).taxes;
    try {
      const response = await updateService(`products/${id}`, data);
      useToastMessageStore.getState().setMessage(response);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      console.error(error);
    } finally {
      closeLoading("productForm");
    }
  }


  return { onSubmit }

}
