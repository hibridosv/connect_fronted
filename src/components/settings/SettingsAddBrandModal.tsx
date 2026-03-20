import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { getServices } from '@/services/services';
import useBrandsStore from '@/stores/products/brandsStore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface SettingsAddBrandModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SettingsAddBrandModal({ show, onClose }: SettingsAddBrandModalProps) {
  const { createBrand, saving } = useBrandsStore();
  const { register, handleSubmit, reset } = useForm();
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    if (show) {
      getServices('contacts?filterWhere[is_provider]==1&filterWhere[status]==1').then((res) => {
        setProviders(res.data.data ?? []);
      });
    }
  }, [show]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: any) => {
    const payload: any = { name: data.name.trim() };
    if (data.provider_id) payload.provider_id = data.provider_id;
    const success = await createBrand(payload);
    if (success) handleClose();
  };

  return (
    <Modal show={show} onClose={handleClose} headerTitle="Agregar Marca" size="sm">
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="input-label">Proveedor (opcional)</label>
            <select className="input-select" {...register('provider_id')}>
              <option value="">Sin proveedor</option>
              {providers.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Nombre</label>
            <input className="input" {...register('name', { required: true })} placeholder="Nombre de la marca" />
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} disabled={saving} />
      </Modal.Footer>
    </Modal>
  );
}
