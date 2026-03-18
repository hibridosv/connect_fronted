import { Button, Preset } from '@/components/button/button';
import { DeleteModal } from '@/components/DeleteModal';
import useModalStore from '@/stores/modalStorage';
import useLocationStore from '@/stores/products/LocationsStore';
import { useEffect, useState } from 'react';
import SettingsAddLocationModal from './SettingsAddLocationModal';

export default function SettingsLocationList() {
  const { locations, loading, loadLocations, deleteLocation, deleting } = useLocationStore();
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const { modals, closeModal, openModal} = useModalStore();


  useEffect(() => {
    loadLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteLocation(deleteTarget.id);
    if (success) setDeleteTarget(null);
  };

  if (loading) return <div className="p-8 text-center text-text-muted text-sm animate-pulse">Cargando ubicaciones...</div>;

  if (!locations || locations.length === 0) return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-text-base">Ubicaciones</span>
        <Button preset={Preset.add} text="Agregar" onClick={() => openModal('locationAdd')} />
      </div>
      <div className="p-8 text-center text-text-muted text-sm">No hay ubicaciones</div>
      <SettingsAddLocationModal show={modals.locationAdd} onClose={() => closeModal('locationAdd')} />
    </div>
  );

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-text-base">Ubicaciones</span>
          <Button preset={Preset.add} text="Agregar" onClick={() => openModal('locationAdd')} />
        </div>

        <div className="divide-y divide-bg-subtle">
          {locations.map((loc: any) => (
            <div key={loc.id} className="flex items-center justify-between py-2.5 px-2 hover:bg-bg-subtle/30 transition-colors">
              <div>
                <span className="text-sm text-text-base">{loc.name}</span>
                {loc.description && <span className="text-xs text-text-muted ml-2">— {loc.description}</span>}
              </div>
              {loc.status !== 1 && (
                <Button preset={Preset.smallClose} onClick={() => setDeleteTarget(loc)} />
              )}
            </div>
          ))}
        </div>
      </div>

      <SettingsAddLocationModal show={modals.locationAdd} onClose={() => closeModal('locationAdd')} />

      <DeleteModal
        isShow={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDelete}
        text={`¿Está seguro de eliminar la ubicación "${deleteTarget?.name}"?`}
        isSending={deleting}
      />
    </>
  );
}
