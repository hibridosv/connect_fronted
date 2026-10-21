'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { useCodeRequest } from '@/hooks/useCodeRequest';
import { useCountdown } from '@/hooks/useCountdown';
import { cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

interface CodeRequestGuardProps {
  permission: string;
  onAuthorized: () => void;
  children: ReactNode;
}

export default function CodeRequestGuard({ permission, onAuthorized, children }: CodeRequestGuardProps) {
  const { isRequired, isModalOpen, setIsModalOpen, activeRequest, loading, loadActiveRequest, requestCode, verifyCode } = useCodeRequest(permission);
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { label: remaining, expired } = useCountdown(activeRequest?.expires_at);
  const hasRequest = !!activeRequest && !expired;

  useEffect(() => {
    if (isModalOpen && hasRequest && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen, hasRequest]);

  const handleClick = async () => {
    if (!isRequired) {
      onAuthorized();
      return;
    }
    setIsModalOpen(true);
    await loadActiveRequest();
  };

  const handleRequest = async () => {
    const { ok, message } = await requestCode();
    if (ok) toast.success('Código solicitado, pídalo al administrador');
    else toast.error(message);
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (code.length < 4) {
      toast.error('El código debe tener 4 caracteres');
      return;
    }
    const { ok, message } = await verifyCode(code);
    setCode('');
    if (!ok) {
      toast.error(message);
      return;
    }
    setIsModalOpen(false);
    onAuthorized();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCode('');
  };

  const childElement = isValidElement(children)
    ? cloneElement(children as ReactElement<{ onClick?: () => void }>, { onClick: handleClick })
    : <span onClick={handleClick}>{children}</span>;

  const modal = isModalOpen && createPortal(
    <Modal
      show={isModalOpen}
      onClose={handleClose}
      headerTitle="Código de seguridad"
      size="xs"
      closeOnOverlayClick={false}
    >
      <Modal.Body>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
            <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          {hasRequest ? (
            <>
              <p className="text-sm text-text-muted text-center">
                Ingrese el código que le comparta el administrador
              </p>

              <input
                ref={inputRef}
                type="text"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="input text-center text-2xl font-bold tracking-[0.5em] uppercase w-full"
                placeholder="- - - -"
              />

              <small className="text-text-muted">Vence en <span className="font-semibold text-warning">{remaining}</span></small>
            </>
          ) : (
            <p className="text-sm text-text-muted text-center">
              {loading ? 'Consultando...' : 'Esta acción requiere autorización. Solicite un código al administrador.'}
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button preset={Preset.close} onClick={handleClose} />
        {hasRequest
          ? <Button preset={loading ? Preset.loading : Preset.save} text='Acceder' onClick={handleSubmit} disabled={loading} />
          : <Button preset={loading ? Preset.loading : Preset.send} text='Solicitar código' onClick={handleRequest} disabled={loading} />
        }
      </Modal.Footer>
    </Modal>,
    document.body
  );

  return (
    <>
      {childElement}
      {modal}
    </>
  );
}
