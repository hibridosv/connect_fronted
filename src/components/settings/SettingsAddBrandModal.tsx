import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { ContactSearch } from '@/components/search/ContactSearch';
import useBrandsStore from '@/stores/products/brandsStore';
import { useForm } from 'react-hook-form';

interface SettingsAddBrandModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SettingsAddBrandModal({ show, onClose }: SettingsAddBrandModalProps) {
  const { createBrand, saving } = useBrandsStore();
  const { register, handleSubmit, reset, setValue } = useForm();

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
            <input type="hidden" {...register('provider_id')} />
            <ContactSearch
              param="suppliers"
              placeholder="Buscar Proveedor"
              tempSelectedName="brandModalProvider"
              onSelect={(contact) => setValue('provider_id', contact.id)}
              onClear={() => setValue('provider_id', '')}
            />
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
