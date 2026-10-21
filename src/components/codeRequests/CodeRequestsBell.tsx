'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useReverb from '@/hooks/useReverb';
import { useCountdown } from '@/hooks/useCountdown';
import { CodeRequest } from '@/interfaces/codeRequest';
import { permissionExists } from '@/lib/utils';
import useCodeRequestStore from '@/stores/codeRequestStore';
import useConfigStore from '@/stores/configStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiClipboard } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';

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
 * Aviso y listado de codigos solicitados para quien tiene code-view.
 */
export const CodeRequestsBell = () => {
  const { permission, tenant } = useConfigStore();
  const canView = !!permission && permissionExists(permission, 'code-view');
  const { requests, loading, isPanelOpen, openPanel, closePanel, loadRequests, cancelRequest } = useCodeRequestStore();
  const { data, random } = useReverb(`${tenant?.id}-channel-code-requests`, 'CodeRequestEvent', canView && !!tenant?.id);

  useEffect(() => {
    if (canView) loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  useEffect(() => {
    if (!data || !canView) return;
    if (data.action === 'requested') toast(data.message, { icon: '🔑' });
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, random, canView]);

  if (!canView) return null;

  const count = requests.filter((request) => new Date(request.expires_at).getTime() > Date.now()).length;

  return (
    <>
      <button onClick={openPanel} className="relative text-text-inverted hover:text-secondary clickeable" title="Códigos solicitados">
        <IoKeyOutline size={22} className="sm:w-7 sm:h-7" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 flex items-center justify-center bg-danger text-white text-[10px] font-bold rounded-full leading-none">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      <Modal show={isPanelOpen} onClose={closePanel} headerTitle="Códigos solicitados" size="md">
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
          <Button preset={Preset.close} onClick={closePanel} />
        </Modal.Footer>
      </Modal>
    </>
  );
};
