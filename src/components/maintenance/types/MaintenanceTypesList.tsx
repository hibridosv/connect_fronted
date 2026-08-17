'use client';
import { Button, Preset } from '@/components/button/button';
import { DeleteModal } from '@/components/DeleteModal';
import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { MaintenanceType } from '@/interfaces/maintenance';
import useMaintenanceTypesStore from '@/stores/maintenance/maintenanceTypesStore';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import { MdEdit, MdOutlineListAlt } from 'react-icons/md';

export interface MaintenanceTypesListProps {
  types: MaintenanceType[] | null;
  loading: boolean;
}

export function MaintenanceTypesList({ types, loading }: MaintenanceTypesListProps) {
  const { deleteType, deleting } = useMaintenanceTypesStore();
  const { modals, openModal, closeModal } = useModalStore();
  const { setElement, getElement } = useTempStorage();
  const deleteTarget = getElement('maintenanceTypeDelete');

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteType(deleteTarget.id);
    if (success) closeModal('deleteMaintenanceType');
  };

  if (loading) return <SkeletonTable rows={5} columns={3} />;
  if (!types || types.length === 0) return <NothingHere text="No hay tipos de mantenimiento registrados" />;

  return (
    <div>
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
              <button
                onClick={() => { setElement('maintenanceTypeForm', type); openModal('maintenanceTypeForm'); }}
                className="p-2 text-text-muted hover:text-primary transition-colors"
                title="Editar"
              >
                <MdEdit size={18} />
              </button>
              <Button
                preset={Preset.smallClose}
                onClick={() => { setElement('maintenanceTypeDelete', type); openModal('deleteMaintenanceType'); }}
              />
            </div>
          </div>
        ))}
      </div>

      <DeleteModal
        isShow={deleteTarget?.id && modals.deleteMaintenanceType}
        header="Eliminar tipo de mantenimiento"
        text={`¿Estás seguro de eliminar "${deleteTarget?.name}"? La eliminación falla si existen órdenes registradas con este tipo.`}
        onDelete={handleDelete}
        onClose={() => closeModal('deleteMaintenanceType')}
        isSending={deleting}
      />
    </div>
  );
}
