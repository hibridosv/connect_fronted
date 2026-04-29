'use client';
import { Button, Preset } from '@/components/button/button';
import { NothingHere } from '@/components/NothingHere';
import { RestaurantMenuSkeleton } from '@/components/skeleton/RestaurantMenuSkeleton';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';
import { URL } from '@/constants';
import { useMenuReorderLogic } from '@/hooks/restaurant/useMenuReorderLogic';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
  `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`;

export default function Page() {
  const { restaurantMenu, loadingMenu, categories, loadingCategories, primaryCategoryId, saving, saveReorder } =
    useMenuReorderLogic();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragSourceIndex = useRef<number | null>(null);

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

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  const isPrimarySelected = selectedCategoryId === null || selectedCategoryId === primaryCategoryId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Reordenar Iconos" />

        <div className="w-full px-2 py-3">
          {loadingMenu ? (
            <RestaurantMenuSkeleton imageQuantity={20} />
          ) : orderedItems.length === 0 ? (
            <NothingHere text="No hay iconos para mostrar" />
          ) : (
            <div className={`flex flex-wrap justify-center gap-3 ${isDragging ? 'cursor-grabbing' : ''}`}>
              {orderedItems.map((record: any, index: number) => {
                const isProduct = record.icon_type === 1;
                const label = isProduct ? record?.product?.description : record?.category?.name;
                const imageSrc = isProduct ? record?.product?.restaurant?.image : record?.category?.img;
                const isBeingDragged = dragSourceIndex.current === index;

                return (
                  <div
                    key={record.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    title={label}
                    className={`cursor-grab active:cursor-grabbing transition-opacity duration-150 ${isBeingDragged ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <div className="relative w-[104px] overflow-hidden rounded-xl bg-bg-content shadow-md select-none">
                      <div className="relative h-[104px] w-[104px] overflow-hidden">
                        {imageSrc && (
                          <Image
                            loader={imageLoader}
                            src={imageSrc}
                            alt={label || 'Icono'}
                            width={104}
                            height={104}
                            className="h-full w-full object-cover pointer-events-none"
                          />
                        )}
                        <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/30">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className={`flex h-10 items-center justify-center px-1.5 ${
                          isProduct ? 'bg-bg-subtle/80' : 'bg-slate-300'
                        }`}
                      >
                        <p
                          className={`w-full text-center text-[12px] font-semibold uppercase leading-tight line-clamp-2 ${
                            isProduct ? 'text-text-base' : 'text-black'
                          }`}
                        >
                          {label}
                        </p>
                      </div>
                      {!isProduct && (
                        <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/90 shadow-sm">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-3">
        <ViewTitle text="Categorias" />
        {loadingCategories ? (
          <div className="mx-4">
            <SkeletonTable rows={4} columns={1} />
          </div>
        ) : !categories || categories.length === 0 ? (
          <NothingHere height="150" width="150" text="No hay categorías disponibles" />
        ) : (
          <div className="mx-4">
            <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
              <ul className="divide-y divide-bg-subtle">
                <li
                  className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                    isPrimarySelected
                      ? 'bg-primary/10 text-text-base font-semibold'
                      : 'text-text-muted hover:bg-bg-subtle'
                  }`}
                  onClick={() => handleSelectCategory(null)}
                >
                  <span>Principal</span>
                </li>
                {categories
                  .filter((category: any) => category.id !== primaryCategoryId)
                  .map((category: any) => {
                    const isSelected = selectedCategoryId === category.id;
                    return (
                      <li
                        key={category.id}
                        className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                          isSelected
                            ? 'bg-primary/10 text-text-base font-semibold'
                            : 'text-text-muted hover:bg-bg-subtle'
                        }`}
                        onClick={() => handleSelectCategory(category.id)}
                      >
                        <Image
                          loader={({ src, width, quality }) =>
                            `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
                          }
                          src={category?.img || 'default.png'}
                          alt="Icono de categoría"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{category?.name}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}
        <div className="mx-4 mt-3">
          <Button preset={saving || loadingMenu ? Preset.saving : Preset.save} onClick={() => saveReorder(orderedItems)} disabled={saving || loadingMenu} isFull />
        </div>
      </div>
      <ToasterMessage />
    </div>
  );
}

