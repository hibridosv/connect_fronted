'use client';
import { createService } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import restauranMenuStore from '@/stores/orders/restauranMenuStore';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useMemo, useRef, useState } from 'react';

export function useMenuReorderLogic() {
  const { activeConfig } = useConfigStore();
  const { restaurantMenu, loading: loadingMenu, isLoaded, _hasHydrated, getRestauranMenu } = restauranMenuStore();
  const { categories, loadingCategories, loadCategories } = manageRestaurantStore();

  const [saving, setSaving] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragSourceIndex = useRef<number | null>(null);

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

  const filteredItems = useMemo(() => {
    if (!restaurantMenu) return [];
    const effectiveCategoryId = selectedCategoryId ?? primaryCategoryId;
    if (!effectiveCategoryId || effectiveCategoryId === primaryCategoryId) {
      return restaurantMenu.filter((item: any) => {
        if (item.icon_type === 2 && item.category?.id === primaryCategoryId) return false;
        if (item.icon_type === 1 && item.product?.category_id !== primaryCategoryId) return false;
        return true;
      });
    }
    return restaurantMenu.filter(
      (item: any) => item.icon_type === 1 && item.product?.category_id === effectiveCategoryId
    );
  }, [restaurantMenu, selectedCategoryId, primaryCategoryId]);

  useEffect(() => {
    setOrderedItems(filteredItems);
  }, [filteredItems]);

  const hasChanges = useMemo(
    () => orderedItems.length === filteredItems.length && orderedItems.some((item, i) => item.id !== filteredItems[i]?.id),
    [orderedItems, filteredItems]
  );

  const handleSelectCategory = (categoryId: string | null) => setSelectedCategoryId(categoryId);

  const handleDragStart = (index: number) => {
    dragSourceIndex.current = index;
    setIsDragging(true);
  };

  const handleDragEnter = (index: number) => {
    if (dragSourceIndex.current === null || dragSourceIndex.current === index) return;
    const reordered = [...orderedItems];
    const [draggedItem] = reordered.splice(dragSourceIndex.current, 1);
    reordered.splice(index, 0, draggedItem);
    dragSourceIndex.current = index;
    setOrderedItems(reordered);
  };

  const handleDragEnd = () => {
    dragSourceIndex.current = null;
    setIsDragging(false);
  };

  const saveReorder = async () => {
    setSaving(true);
    try {
      const total = orderedItems.length;
      const payload = { items: orderedItems.map((item, index) => ({ id: item.id, order: total - index })) };
      const response = await createService('menu/reorder', payload);
      useToastMessageStore.getState().setMessage(response);
      await getRestauranMenu(menuUrl);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setSaving(false);
    }
  };

  const isPrimarySelected = selectedCategoryId === null || selectedCategoryId === primaryCategoryId;

  return {
    loadingMenu,
    categories,
    loadingCategories,
    primaryCategoryId,
    saving,
    hasChanges,
    orderedItems,
    isDragging,
    dragSourceIndex,
    isPrimarySelected,
    selectedCategoryId,
    saveReorder,
    handleSelectCategory,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
