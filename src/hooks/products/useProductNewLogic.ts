'use client'
import { getCountryProperty } from '@/lib/utils'
import { createService } from '@/services/services'
import useConfigStore from '@/stores/configStore'
import useDefaultContactStore from '@/stores/defaultContactStore'
import useModalStore from '@/stores/modalStorage'
import useBrandsStore from '@/stores/products/brandsStore'
import useCategoriesStore from '@/stores/products/categoriesStore'
import useLocationStore from '@/stores/products/LocationsStore'
import useQuantityUnitStore from '@/stores/products/QuantityUnitStore'
import useStateStore from '@/stores/stateStorage'
import useToastMessageStore from '@/stores/toastMessageStore'
import useTempStorage from '@/stores/useTempStorage'
import { useEffect, useState } from 'react'
import { useGetRequest } from '../request/useGetRequest'

export function useProductNewLogic(setValue?: (field: string, value: any) => void, reset?: () => void) {
  const { loadCategories, categories, loading: loadingCategories } = useCategoriesStore();
  const { loadBrands, brands, loading: loadingBrands } = useBrandsStore();
  const { loadQuantityUnits, quantityUnits, loading: loadingQuantityUnits } = useQuantityUnitStore();
  const { loadLocations, locations, loading: loadingLocations } = useLocationStore();
  const { activeConfig, system } = useConfigStore();
  const { openLoading, closeLoading } = useStateStore();
  const { openModal } = useModalStore();
  const { getElement, setElement, clearElement } = useTempStorage();
  const { defaultContact } = useDefaultContactStore();
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const { getRequest, responseData: products } = useGetRequest();

  const productType: number = getElement('productNewType') ?? 1;

  useEffect(() => {
    if (!getElement('productNewType')) setElement('productNewType', 1);
  // eslint-disable-next-line
  }, []);

  useEffect(() => {

    if (!products) {
      getRequest("products?sort=-created_at&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices,category,quantityUnit,provider,brand,location&perPage=15&page=1");
    }
    if (!categories) {
      loadCategories("categories?sort=-created_at&included=subcategories&filterWhere[category_type]==1&filterWhere[is_restaurant]==0");
    }
    if (!brands && (activeConfig && activeConfig.includes('product-brand'))) {
      loadBrands("brands");
    }
    if (!quantityUnits) {
      loadQuantityUnits("quantityunits");
    }
    if (!locations && (activeConfig && activeConfig.includes('product-locations'))) {
      loadLocations('locations');
    }
  // eslint-disable-next-line
  }, [getRequest, loadCategories, loadBrands, loadQuantityUnits, loadLocations]);

  const onSubmit = async (data: any) => {
    openLoading("productForm");
    data.product_type = productType;
    if (productType != 1) {
      data.quantity = 1;
      data.minimum_stock = 1;
    }
    if (data.expiration) data.expires = 1;
    if (!data.unit_cost) data.unit_cost = 0;
    if (!data.sale_price) data.sale_price = 0;
    data.taxes = getCountryProperty(parseInt(system?.country)).taxes;
    const selectedProvider = getElement('productNewProvider');
    data.provider_id = selectedProvider?.id ?? defaultContact?.id ?? 0;
    try {
      const response = await createService('products', data);
      useToastMessageStore.getState().setMessage(response);
      await getRequest("products?sort=-created_at&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices,category,quantityUnit,provider,brand,location&perPage=15&page=1");
      if (reset) {
        reset();
        setElement('productNewType', 1);
        clearElement('productNewProvider');
        if (setValue) {
          if (subCategories?.length > 0) setValue('category_id', subCategories[0].id);
          if (quantityUnits?.length > 0) setValue('quantity_unit_id', quantityUnits[0].id);
          if (brands?.length > 0) setValue('brand_id', brands[0].id);
          if (locations?.length > 0) setValue('location_id', locations[0].id);
        }
      }
      if (productType == 3) {
        openModal('productLinked');
      }
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      console.error(error);
    } finally {
      closeLoading("productForm");
    }
  }

  useEffect(() => {
    if (categories) {
      const allSubcategories = categories.flatMap((category: any) => category.subcategories || []);
      setSubCategories(allSubcategories);
    }
    // eslint-disable-next-line
  }, [categories]);

  useEffect(() => {
    if (setValue && subCategories?.length > 0) setValue('category_id', subCategories[0].id);
    // eslint-disable-next-line
  }, [subCategories]);

  useEffect(() => {
    if (setValue && quantityUnits?.length > 0) setValue('quantity_unit_id', quantityUnits[0].id);
    // eslint-disable-next-line
  }, [quantityUnits]);

  useEffect(() => {
    if (setValue && brands?.length > 0) setValue('brand_id', brands[0].id);
    // eslint-disable-next-line
  }, [brands]);

  useEffect(() => {
    if (setValue && locations?.length > 0) setValue('location_id', locations[0].id);
    // eslint-disable-next-line
  }, [locations]);

  const loadingSelects = loadingCategories || loadingQuantityUnits || loadingBrands || loadingLocations;

  return { onSubmit, productType, setElement, subCategories, products, brands, quantityUnits, locations, loadingSelects }

}
