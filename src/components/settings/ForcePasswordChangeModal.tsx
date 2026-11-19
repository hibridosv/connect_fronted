'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useConfigStore from '@/stores/configStore';
import useUserStore from '@/stores/UserStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Root marco al usuario con must_change_password: no se puede cerrar hasta que cambie su contraseña.
// Solo es aviso de pulse; connect no bloquea la API.
export function ForcePasswordChangeModal() {
  const { user, reloadConfig } = useConfigStore();
  const { updateUserPassword, saving } = useUserStore();
  const { register, handleSubmit, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (data: any) => {
    const success = await updateUserPassword(`users/${user?.id}/password`, data);
    if (success) {
      reset();
      await reloadConfig(); // connect apaga must_change_password al cambiar la propia contraseña
    }
  };

  return (
    <Modal
      show={!!user?.must_change_password}
      onClose={() => {}}
      closeOnOverlayClick={false}
      hideCloseButton
      size="md"
      headerTitle="Cambia tu contraseña"
    >
      <Modal.Body>
        <p className="text-sm text-text-muted mb-4 px-3">
          Por seguridad debes cambiar tu contraseña antes de continuar.
        </p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
          <div className="flex flex-wrap mb-4">
            <div className="w-full px-3 mb-2">
              <label htmlFor="force-password" className="input-label">Nueva contraseña *</label>
              <div className="flex items-center gap-2">
                <input type={showPassword ? 'text' : 'password'} id="force-password" autoComplete="new-password" {...register('password', { required: true })} className="input" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  className="flex items-center justify-center w-8 h-8 shrink-0 bg-bg-subtle rounded-full cursor-pointer hover:bg-bg-subtle/80"
                >
                  {showPassword ? <FaEyeSlash className="text-text-muted" size={14} /> : <FaEye className="text-text-muted" size={14} />}
                </button>
              </div>
            </div>
            <div className="w-full px-3 mb-2">
              <label htmlFor="force-password-confirm" className="input-label">Repetir contraseña *</label>
              <input type={showPassword ? 'text' : 'password'} id="force-password-confirm" autoComplete="new-password" {...register('password_confirmation', { required: true })} className="input" />
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
