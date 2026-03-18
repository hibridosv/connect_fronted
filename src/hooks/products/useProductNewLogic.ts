'use client'
import { getCountryProperty } from '@/lib/utils'
import { createService } from '@/services/services'
import useConfigStore from '@/stores/configStore'
import useContactStore from '@/stores/ContactStore'
import useModalStore from '@/stores/modalStorage'
import useBrandsStore from '@/stores/products/brandsStore'
import useCategoriesStore from '@/stores/products/categoriesStore'
import useLocationStore from '@/stores/products/LocationsStore'
import useQuantityUnitStore from '@/stores/products/QuantityUnitStore'
import useStateStore from '@/stores/stateStorage'
import useToastMessageStore from '@/stores/toastMessageStore'
import { useEffect, useState } from 'react'
import { useGetRequest } from '../request/useGetRequest'

export function useProductNewLogic() {
  const { loadCategories, categories } = useCategoriesStore();
  const { loadBrands, brands } = useBrandsStore();
  const { loadQuantityUnits, quantityUnits } = useQuantityUnitStore();
  const { loadContacts, contacts: providers } = useContactStore();
  const { loadLocations, locations } = useLocationStore();
  const { activeConfig, system } = useConfigStore();
  const { openLoading, closeLoading } = useStateStore();
  const { openModal } = useModalStore();
  const [subCategories, setSubCategories] = useState([]);
  const { getRequest, responseData: products } = useGetRequest();
  
  useEffect(() => {

    if (!products) {
      getRequest("products?sort=-updated_at&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices,category,quantityUnit,provider,brand,location&perPage=15&page=1");
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
    if (!providers) {
      loadContacts('contacts?sort=-created_at&filterWhere[is_provider]==1&perPage=100&page=1');
    }
    if (!locations && (activeConfig && activeConfig.includes('product-locations'))) {
      loadLocations('locations');
    }
  // eslint-disable-next-line
  }, [getRequest, loadCategories, loadBrands, loadQuantityUnits, loadContacts, loadLocations]);

  const onSubmit = async (data: any) => {
    openLoading("productForm");
    if (data.product_type != 1) {
      data.quantity = 1;
      data.minimum_stock = 1;
    }
    if (data.expiration) data.expires = 1;
    if (!data.unit_cost) data.unit_cost = 0;
    if (!data.sale_price) data.sale_price = 0;
    data.taxes = getCountryProperty(parseInt(system?.country)).taxes;
    try {
      const response = await createService('products', data);
      useToastMessageStore.getState().setMessage(response);
      await getRequest("products?sort=-updated_at&filterWhere[status]==1&filterWhere[is_restaurant]==0&included=prices,category,quantityUnit,provider,brand,location&perPage=15&page=1");
      if (data.product_type == 3) {
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


  return { onSubmit, subCategories, products, brands, quantityUnits, providers, locations }

}
