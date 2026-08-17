'use client';
import { Button, Preset } from '@/components/button/button';
import { DeleteModal } from '@/components/DeleteModal';
import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { MaintenanceType } from '@/interfaces/maintenance';
import useMaintenanceTypesStore from '@/stores/maintenance/maintenanceTypesStore';
import { useState } from 'react';
import { MdEdit, MdOutlineListAlt } from 'react-icons/md';
import { MaintenanceTypeFormModal } from './MaintenanceTypeFormModal';

export interface MaintenanceTypesListProps {
  types: MaintenanceType[] | null;
  loading: boolean;
}

export function MaintenanceTypesList({ types, loading }: MaintenanceTypesListProps) {
  const { deleteType, deleting } = useMaintenanceTypesStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MaintenanceType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceType | null>(null);

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (type: MaintenanceType) => { setEditing(type); setShowForm(true); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteType(deleteTarget.id);
    if (success) setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-2 mb-3">
        <span className="text-sm font-semibold text-text-base">Tipos registrados</span>
        <Button preset={Preset.add} text="Nuevo tipo" onClick={openCreate} />
      </div>

      {loading ? (
        <SkeletonTable rows={5} columns={3} />
      ) : !types || types.length === 0 ? (
        <NothingHere text="No hay tipos de mantenimiento registrados" />
      ) : (
        <div className="divide-y divide-bg-subtle bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
          {types.map((type) => (
            <div key={type.id} className="flex items-center justify-between p-3 hover:bg-bg-subtle/30 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-base truncate">{type.name}</p>
                {type.description && <p className="text-xs text-text-muted truncate">{type.description}</p>}
                <p className="flex items-center gap-1 text-xs text-text-muted mt-1">
                  <MdOutlineListAlt size={13} /> {type.fields_schema?.length ?? 0} campo(s)
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(type)} className="p-2 text-text-muted hover:text-primary transition-colors" title="Editar">
                  <MdEdit size={18} />
                </button>
                <Button preset={Preset.smallClose} onClick={() => setDeleteTarget(type)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <MaintenanceTypeFormModal isShow={showForm} onClose={() => setShowForm(false)} record={editing} />

      <DeleteModal
        isShow={!!deleteTarget}
        header="Eliminar tipo de mantenimiento"
        text={`¿Estás seguro de eliminar "${deleteTarget?.name}"? La eliminación falla si existen órdenes registradas con este tipo.`}
        onDelete={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isSending={deleting}
      />
    </div>
  );
}
