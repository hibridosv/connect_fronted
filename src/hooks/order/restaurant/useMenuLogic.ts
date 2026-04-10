'use client'
import useConfigStore from '@/stores/configStore'
import restauranMenuStore from '@/stores/orders/restauranMenuStore'
import { useEffect } from 'react'

export function useMenuLogic() {
  const { activeConfig } = useConfigStore()
  const { isLoaded, loading, _hasHydrated, getRestauranMenu} = restauranMenuStore()
  const orderIcon =  activeConfig && activeConfig.includes("restaurant-sales-order-menu-alp") ? "alphabet" : "-order";

  useEffect(() => {
    if (_hasHydrated && !isLoaded && !loading) {
      getRestauranMenu(`menu?sort=${orderIcon}&filterWhere[status]==1&included=product.restaurant,category`)
    }
  }, [_hasHydrated, isLoaded, loading, getRestauranMenu, orderIcon])


}
