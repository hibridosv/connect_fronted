'use client';

import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useConfigStore from '@/stores/configStore';
import { signIn } from 'next-auth/react';
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
  const [errorMessage, setErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const { user, clearConfig } = useConfigStore();

  const handleFormSubmit = async (data: any) => {
    setSending(true);
    try {
      const result = await signIn('credentials', {
        username: user?.email,
        password: data.password,
        change: tenantSelect?.url,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(true);
      } else if (result?.ok) {
        setRedirecting(true);
        setErrorMessage(false);
        clearConfig();
        localStorage.removeItem('config-storage');
        localStorage.removeItem('menu-storage');
        window.location.href = '/dashboard';
      }
    } catch {
      setErrorMessage(true);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (isShow) {
      setErrorMessage(false);
      setShowPassword(false);
      reset();
    }
  }, [isShow, reset]);

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle="CAMBIAR SISTEMA">
      <Modal.Body>
        {redirecting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LuLoaderCircle className="animate-spin text-primary" size={40} />
            <p className="mt-3 text-text-muted text-sm">Cargando datos...</p>
          </div>
        ) : (
          <div className="w-full">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
              <div className="max-w-sm">
                <div className="input-disabled py-2 px-4 mb-3">{user?.email}</div>

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
