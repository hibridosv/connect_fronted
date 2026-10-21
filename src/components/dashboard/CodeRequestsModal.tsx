'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useReverb from '@/hooks/useReverb';
import { useCountdown } from '@/hooks/useCountdown';
import { CodeRequest } from '@/interfaces/codeRequest';
import useCodeRequestStore from '@/stores/codeRequestStore';
import useConfigStore from '@/stores/configStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react';
import { FiCheck, FiClipboard } from 'react-icons/fi';

export interface CodeRequestsModalI {
  onClose: () => void;
  isShow: boolean;
}

const CodeRequestRow = ({ request, onCancel }: { request: CodeRequest; onCancel: (id: string) => void }) => {
  const { label, expired } = useCountdown(request.expires_at);
  const [copied, setCopied] = useState(false);
  const { setMessage } = useToastMessageStore();

  if (expired) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(request.code ?? '');
    setCopied(true);
    setMessage({ message: 'Código copiado al portapapeles' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-bg-subtle/60">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-base truncate">{request.user?.name ?? 'Usuario'}</p>
        <p className="text-xs text-text-muted truncate">{request.permission_description ?? request.permission}</p>
        <p className="text-[11px] text-warning">Vence en {label}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-subtle hover:bg-primary/10"
        title="Copiar código"
      >
        <span className="text-2xl font-bold tracking-widest text-primary font-mono">{request.code}</span>
        {copied ? <FiCheck className="text-success" /> : <FiClipboard className="text-text-muted" />}
      </button>
      <Button preset={Preset.smallClose} onClick={() => onCancel(request.id)} />
    </div>
  );
};

/**
 * Codigos solicitados y activos, visible para quien tiene code-view.
 * Mientras esta abierto se actualiza con cada solicitud nueva por Reverb.
 */
export function CodeRequestsModal({ onClose, isShow }: CodeRequestsModalI) {
  const { tenant } = useConfigStore();
  const { requests, loading, loadRequests, cancelRequest } = useCodeRequestStore();
  const { data, random } = useReverb(`${tenant?.id}-channel-code-requests`, 'CodeRequestEvent', isShow && !!tenant?.id);

  useEffect(() => {
    if (isShow) loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow, data, random]);

  if (!isShow) return null;

  return (
    <Modal show={isShow} onClose={onClose} headerTitle="Códigos solicitados" size="md">
      <Modal.Body>
        {loading && requests.length === 0 && (
          <div className="p-6 text-center text-text-muted text-sm">Cargando...</div>
        )}
        {!loading && requests.length === 0 && (
          <div className="p-8 text-center text-text-muted text-sm">No hay códigos activos</div>
        )}
        {requests.map((request) => (
          <CodeRequestRow key={request.id} request={request} onCancel={cancelRequest} />
        ))}
        <small className="block mt-3 text-center text-text-muted">Cada código es de un solo uso y vence a los 15 minutos de solicitarse.</small>
      </Modal.Body>
      <Modal.Footer>
        <Button preset={Preset.close} onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
}
