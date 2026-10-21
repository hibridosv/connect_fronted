'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { usePutRequest } from '@/hooks/request/usePutRequest';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  isShow: boolean;
  onClose: () => void;
  record: any;
  onUpdated: (record: any) => void;
}

export function ReportEnteredEditModal({ isShow, onClose, record, onUpdated }: Props) {
  const { putRequest, responseData, loading } = usePutRequest() as any;
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (isShow && record) {
      reset({
        lot: record.lot ?? '',
        expiration: record.expiration ? String(record.expiration).substring(0, 10) : '',
        unit_cost: record.unit_cost ?? 0,
      });
    }
  }, [isShow, record, reset]);

  useEffect(() => {
    if (responseData?.data) {
      onUpdated(responseData.data);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData]);

  const onSubmit = async (data: any) => {
    await putRequest(`registers/${record.id}`, {
      lot: data.lot || null,
      expiration: data.expiration || null,
      unit_cost: data.unit_cost,
    });
  };

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="Editar ingreso">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="p-2 space-y-3">
            <div className="font-semibold">{record?.product?.description}</div>
            <div>
              <label htmlFor="entered-lot" className="input-label">Lote</label>
              <input type="text" id="entered-lot" {...register('lot')} className="input" />
            </div>
            <div>
              <label htmlFor="entered-expiration" className="input-label">Fecha de vencimiento</label>
              <input type="date" id="entered-expiration" {...register('expiration')} className="input" />
            </div>
            <div>
              <label htmlFor="entered-unit-cost" className="input-label">Precio costo *</label>
              <input type="number" id="entered-unit-cost" step="any" min="0" {...register('unit_cost', { required: true })} className="input" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} preset={Preset.close} disabled={loading} />
          <Button onClick={handleSubmit(onSubmit)} preset={loading ? Preset.saving : Preset.save} disabled={loading} text="Guardar" />
        </Modal.Footer>
      </form>
    </Modal>
  );
}
