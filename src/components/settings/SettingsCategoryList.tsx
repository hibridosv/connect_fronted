import { Button, Preset } from '@/components/button/button';
import { DeleteModal } from '@/components/DeleteModal';
import useCategoriesStore from '@/stores/products/categoriesStore';
import { useEffect, useState } from 'react';
import SettingsAddCategoryModal from './SettingsAddCategoryModal';

export default function SettingsCategoryList() {
  const { categories, loading, loadCategories, deleteCategory, deleting } = useCategoriesStore();
  const [showAdd, setShowAdd] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteCategory(deleteTarget.id);
    if (success) setDeleteTarget(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const canDelete = (cat: any) => {
    if (cat.principal === 1) return false;
    const filteredSubs = (cat.subcategories ?? []).filter((sub: any) => sub.is_restaurant === 0);
    if (filteredSubs.length > 0) return false;
    return true;
  };


  if (!categories || categories.length === 0) return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-text-base">Categorías</span>
        <Button preset={Preset.add} text="Agregar" onClick={() => setShowAdd(true)} />
      </div>
      <div className="p-8 text-center text-text-muted text-sm">No hay categorías</div>
      <SettingsAddCategoryModal show={showAdd} onClose={() => setShowAdd(false)} categories={[]} />
    </div>
  );

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-text-base">Categorías</span>
          <Button preset={Preset.add} text="Agregar" onClick={() => setShowAdd(true)} />
        </div>

        <div className="divide-y divide-bg-subtle">
          {categories.map((cat: any) => {
            const filteredSubs = (cat.subcategories ?? []).filter((sub: any) => sub.is_restaurant === 0);
            const hasSubs = filteredSubs.length > 0;
            const isExpanded = expandedIds.includes(cat.id);

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between py-2 px-2 hover:bg-bg-subtle/30 transition-colors">
                  <div className="flex items-center gap-2 clickeable" onClick={() => hasSubs && toggleExpand(cat.id)}>
                    <div className={`text-text-muted text-xs w-5 ${hasSubs ? 'hover:text-text-base' : 'invisible'}`} >
                      {isExpanded ? '▼' : '▶'}
                    </div>
                    <span className="text-sm text-text-base font-medium">{cat.name}</span>
                    {hasSubs && (
                      <span className="text-xs text-text-muted">({filteredSubs.length})</span>
                    )}
                  </div>
                  {canDelete(cat) && (
                    <Button preset={Preset.smallClose} onClick={() => setDeleteTarget(cat)} />
                  )}
                </div>

                {isExpanded && hasSubs && (
                  <div className="ml-8 border-l border-bg-subtle">
                    {filteredSubs.map((sub: any) => (
                      <div key={sub.id} className="flex items-center justify-between py-1.5 px-3 hover:bg-bg-subtle/20">
                        <span className="text-sm text-text-muted">{sub.name}</span>
                        {sub.principal !== 1 && (
                          <Button preset={Preset.smallClose} onClick={() => setDeleteTarget(sub)} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SettingsAddCategoryModal
        show={showAdd}
        onClose={() => setShowAdd(false)}
        categories={categories}
      />

      <DeleteModal
        isShow={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDelete}
        text={`¿Está seguro de eliminar "${deleteTarget?.name}"?`}
        isSending={deleting}
      />
    </>
  );
}
