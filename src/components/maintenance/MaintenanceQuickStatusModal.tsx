'use client';
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { MAINTENANCE_STATUSES } from "@/lib/maintenance";
import useMaintenanceStore from "@/stores/maintenance/maintenanceStore";
import { useEffect, useState } from "react";

export interface MaintenanceQuickStatusModalProps {
  isShow: boolean;
  onClose: () => void;
  maintenanceId: string;
  currentStatus: number;
  onUpdated?: () => void;
}

export function MaintenanceQuickStatusModal({ isShow, onClose, maintenanceId, currentStatus, onUpdated }: MaintenanceQuickStatusModalProps) {
  const { updateMaintenanceStatus, updatingStatus } = useMaintenanceStore();
  const [status, setStatus] = useState(currentStatus);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isShow) {
      setStatus(currentStatus);
      setComment('');
    }
  }, [isShow, currentStatus]);

  const handleSubmit = async () => {
    const success = await updateMaintenanceStatus(maintenanceId, { status, comment });
    if (success) {
      onUpdated?.();
      onClose();
    }
  };

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={onClose} headerTitle="Cambiar estado" size="sm" closeOnOverlayClick={false}>
      <Modal.Body>
        <div className="space-y-3">
          <div>
            <label className="input-label">Nuevo estado</label>
            <select className="input-select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
              {MAINTENANCE_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Comentario</label>
            <textarea rows={2} className="input w-full resize-none" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={updatingStatus} />
        <Button onClick={handleSubmit} disabled={updatingStatus} preset={updatingStatus ? Preset.saving : Preset.save} />
      </Modal.Footer>
    </Modal>
  );
}
