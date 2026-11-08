import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { updateService } from '@/services/services';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface SettingsInvoiceTypeModalProps {
  isShow: boolean;
  onClose: () => void;
  invoiceType: any;
  // recibe la lista completa de documentos que devuelve el PUT
  onSaved: (invoiceTypes: any[]) => void;
}

const emptyToNull = (value: any) => (value === '' || value === undefined ? null : value);

export default function SettingsInvoiceTypeModal({ isShow, onClose, invoiceType, onSaved }: SettingsInvoiceTypeModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isShow && invoiceType) {
      reset({
        name: invoiceType.name ?? '',
        correlative: invoiceType.correlative ?? '',
        prefix: invoiceType.prefix ?? '',
        inicial_number: invoiceType.inicial_number ?? 1,
        final_number: invoiceType.final_number ?? '',
        last_at: invoiceType.last_at ? String(invoiceType.last_at).slice(0, 10) : '',
      });
    }
  }, [isShow, invoiceType, reset]);

  if (!isShow || !invoiceType) return null;

  const save = async (data: any) => {
    setSaving(true);
    try {
      const response = await updateService(`invoice/type/${invoiceType.id}`, data);
      useToastMessageStore.getState().setMessage(response);
      onSaved(response.data.data ?? []);
      onClose();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = (data: any) => save({
    name: data.name.trim(),
    correlative: data.correlative.trim(),
    prefix: emptyToNull(data.prefix?.trim()),
    inicial_number: Number(data.inicial_number),
    final_number: data.final_number === '' ? null : Number(data.final_number),
    last_at: emptyToNull(data.last_at),
  });

  const isDefault = invoiceType.status === 1;
  const canBeDefault = invoiceType.status === 0;

  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="Editar documento" closeOnOverlayClick={!saving}>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="input-label">Nombre *</label>
            <input className="input" {...register('name', { required: true })} />
          </div>
          <div>
            <label className="input-label">Correlativo *</label>
            <input className="input" {...register('correlative', { required: true })} placeholder="Nombre del lote de documentos" />
          </div>
          <div>
            <label className="input-label">Prefijo</label>
            <input className="input" {...register('prefix')} />
            {invoiceType.is_electronic === 1 && (
              <p className="text-xs text-warning mt-1">
                En los documentos electrónicos el prefijo forma el número de control del DTE: cambiarlo cambia la serie de los documentos siguientes.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="input-label">Número inicial *</label>
              <input type="number" min={0} className="input" {...register('inicial_number', { required: true })} />
            </div>
            <div>
              <label className="input-label">Número final</label>
              <input type="number" min={0} className="input" {...register('final_number')} />
            </div>
            <div>
              <label className="input-label">Vence</label>
              <input type="date" className="input" {...register('last_at')} />
            </div>
          </div>
          <p className="text-xs text-text-muted">
            El número inicial, el final y el vencimiento son informativos: no cambian el número de la siguiente venta.
          </p>

          <div className="flex justify-center">
            <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-bg-subtle flex items-center justify-between gap-3">
          <div className="text-sm text-text-base">
            <span className="font-semibold">Predeterminado general</span>
            <p className="text-xs text-text-muted">Lo usan las órdenes de quien no tiene caja abierta o de las cajas sin documento asignado.</p>
          </div>
          {isDefault ? (
            <span className="text-xs font-medium text-success whitespace-nowrap">Es el general</span>
          ) : (
            <Button preset={Preset.primary} text="Marcar como general" disabled={saving || !canBeDefault} onClick={() => save({ status: 1 })} />
          )}
        </div>
        {!isDefault && !canBeDefault && (
          <p className="text-xs text-text-muted mt-2">Solo un documento habilitado puede ser el predeterminado general.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={saving} />
      </Modal.Footer>
    </Modal>
  );
}
