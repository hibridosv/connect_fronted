'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { LuArrowLeftRight } from 'react-icons/lu';

interface LinkTenantModalProps {
  isShow: boolean;
  onClose: () => void;
  onConfirm: (tenantId: number) => void;
  tenantSelect: any;
  currentName?: string;
  sending: boolean;
}

export function LinkTenantModal({ isShow, onClose, onConfirm, tenantSelect, currentName, sending }: LinkTenantModalProps) {
  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="VINCULAR SISTEMA">
      <Modal.Body>
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <LuArrowLeftRight size={22} />
          </div>
          <div className="text-sm text-text-muted">Se vinculará</div>
          <div className="w-full rounded-lg border border-bg-subtle divide-y divide-bg-subtle">
            <div className="px-3 py-2 font-semibold uppercase text-text-base truncate">{currentName ?? 'Sistema actual'}</div>
            <div className="px-3 py-2 font-semibold uppercase text-primary truncate">{tenantSelect?.description}</div>
          </div>
          <p className="text-xs text-text-muted">
            Los dos sistemas podrán enviarse y solicitarse transferencias entre sí. El vínculo no se puede quitar desde esta pantalla.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={sending} />
        <Button
          onClick={() => onConfirm(tenantSelect?.id)}
          preset={sending ? Preset.saving : Preset.accept}
          text={sending ? undefined : 'Vincular'}
          disabled={sending || !tenantSelect?.id}
        />
      </Modal.Footer>
    </Modal>
  );
}
