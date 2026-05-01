'use client';
import { Alert } from '@/components/Alert/Alert';
import { Button, Preset } from '@/components/button/button';
import { ReorderCategoriesList } from '@/components/restaurant/ReorderCategoriesList';
import { ReorderIconsGrid } from '@/components/restaurant/ReorderIconsGrid';
import { ToasterMessage } from '@/components/toaster-message';
import { ViewTitle } from '@/components/ViewTitle';
import { useMenuReorderLogic } from '@/hooks/restaurant/useMenuReorderLogic';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const {
    loadingMenu, categories, loadingCategories, primaryCategoryId,
    saving, hasChanges, orderedItems, isDragging, dragSourceIndex,
    isPrimarySelected, selectedCategoryId,
    saveReorder, handleSelectCategory, handleDragStart, handleDragEnter, handleDragEnd,
  } = useMenuReorderLogic();

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Reordenar Iconos" />
        <div className="px-4 pt-2 pb-1">
          <Alert type="info" text="Arrastra los iconos para cambiar su orden en el menú. Los cambios se aplican al guardar." />
        </div>
        <div className="w-full px-2 py-3">
          <ReorderIconsGrid
            items={orderedItems}
            loading={loadingMenu}
            isDragging={isDragging}
            dragSourceIndex={dragSourceIndex}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        </div>
      </div>

      <div className="md:col-span-3">
        <ViewTitle text="Categorias" />
        <div className="px-4 pt-2 pb-1">
          <Alert type="info" text="Selecciona una categoría para ordenar sus iconos." />
        </div>
        <ReorderCategoriesList
          categories={categories}
          loading={loadingCategories}
          selectedCategoryId={selectedCategoryId}
          primaryCategoryId={primaryCategoryId}
          isPrimarySelected={isPrimarySelected}
          onSelectCategory={handleSelectCategory}
        />
        <div className="mx-4 mt-3">
          {hasChanges
            ? <Button preset={saving ? Preset.saving : Preset.save} onClick={saveReorder} disabled={saving || loadingMenu} isFull />
            : <Button text="Regresar" preset={Preset.back} onClick={() => router.back()} isFull />
          }
        </div>
      </div>
      <ToasterMessage />
    </div>
  );
}
