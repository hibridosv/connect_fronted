'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { API_URL } from '@/constants';
import useConfigStore from '@/stores/configStore';
import { getSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LuLoaderCircle } from 'react-icons/lu';

interface ChangeTenantModalProps {
  isShow: boolean;
  onClose: () => void;
  tenantSelect: any;
}

export function ChangeTenantModal({ isShow, onClose, tenantSelect }: ChangeTenantModalProps) {
  const [sending, setSending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [remoteUrlData, setRemoteUrlData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const { user, clearConfig } = useConfigStore();

  const getRemoteUrl = async () => {
    setSending(true);
    try {
      const response = await fetch(`${API_URL}oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, change: tenantSelect?.url }),
      });
      const data = await response.json();
      if (data.type === 'error') {
        setErrorMessage(true);
      } else {
        setRemoteUrlData(data);
        setValue('username', user?.email ?? '');
        setErrorMessage(false);
      }
    } catch {
      setErrorMessage(true);
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setSending(true);
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        tenantUrl: remoteUrlData?.url ?? tenantSelect?.url,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(true);
      } else if (result?.ok) {
        setRedirecting(true);
        setErrorMessage(false);
        clearConfig();
        const session = await getSession();
        localStorage.removeItem('config-storage');
        localStorage.removeItem('menu-storage');
        document.cookie = `tenant-status=${session?.status ?? 0}; path=/; SameSite=Lax`;
        window.location.href = '/dashboard';
      }
    } catch {
      setErrorMessage(true);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (isShow && tenantSelect) {
      setErrorMessage(false);
      setRemoteUrlData(null);
      setShowPassword(false);
      getRemoteUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="CAMBIAR SISTEMA">
      <Modal.Body>
        {sending ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LuLoaderCircle className="animate-spin text-primary" size={40} />
            <p className="mt-3 text-text-muted text-sm">Conectando...</p>
          </div>
        ) : redirecting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LuLoaderCircle className="animate-spin text-primary" size={40} />
            <p className="mt-3 text-text-muted text-sm">Cargando datos...</p>
          </div>
        ) : (
          <div className="w-full">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
              <div className="max-w-sm">
                <div className="input-disabled py-2 px-4 mb-3">{user?.email}</div>
                <input type="hidden" {...register('username')} />

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-full">
                    <label htmlFor="password" className="input-label">Contraseña</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="input"
                    />
                  </div>
                  <div
                    className="flex items-center justify-center w-8 h-8 bg-bg-subtle rounded-full cursor-pointer hover:bg-bg-subtle/80 mt-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? <FaEyeSlash className="text-text-muted" size={14} />
                      : <FaEye className="text-text-muted" size={14} />
                    }
                  </div>
                </div>

                <div className="mt-4">
                  <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.send} isFull />
                </div>

                {errorMessage && (
                  <div className="text-danger text-center mt-4 text-sm">Error al ingresar</div>
                )}
              </div>
            </form>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={sending || redirecting} />
      </Modal.Footer>
    </Modal>
  );
}
