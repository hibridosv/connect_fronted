'use client';
import { createService } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import restauranMenuStore from '@/stores/orders/restauranMenuStore';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useMemo, useState, useEffect } from 'react';

export function useMenuReorderLogic() {
  const { activeConfig } = useConfigStore();
  const { restaurantMenu, loading: loadingMenu, isLoaded, _hasHydrated, getRestauranMenu } = restauranMenuStore();
  const { categories, loadingCategories, loadCategories } = manageRestaurantStore();
  const [saving, setSaving] = useState(false);

  const orderIcon = activeConfig && activeConfig.includes('restaurant-sales-order-menu-alp') ? 'alphabet' : '-order';
  const menuUrl = `menu?sort=${orderIcon}&filterWhere[status]==1&included=product.restaurant,category`;

  useEffect(() => {
    if (_hasHydrated && !isLoaded && !loadingMenu) {
      getRestauranMenu(menuUrl);
    }
  }, [_hasHydrated, isLoaded, loadingMenu, getRestauranMenu, menuUrl]);

  useEffect(() => {
    if (!categories && !loadingCategories) {
      loadCategories('categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1');
    }
  }, [categories, loadingCategories, loadCategories]);

  const primaryCategoryId = useMemo(() => {
    if (!restaurantMenu) return null;
    const primaryItem = restaurantMenu.find((item: any) => item.icon_type === 2 && item.alphabet === 'PRI');
    return primaryItem ? primaryItem.category_id : null;
  }, [restaurantMenu]);

  const saveReorder = async (items: any[]) => {
    setSaving(true);
    try {
      const total = items.length;
      const payload = { items: items.map((item, index) => ({ id: item.id, order: total - index })) };
      const response = await createService('menu/reorder', payload);
      useToastMessageStore.getState().setMessage(response);
      await getRestauranMenu(menuUrl);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setSaving(false);
    }
  };

  return {
    restaurantMenu,
    loadingMenu,
    categories,
    loadingCategories,
    primaryCategoryId,
    saving,
    saveReorder,
  };
}
