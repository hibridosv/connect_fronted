'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import useConfigStore from '@/stores/configStore';
import useUserStore from '@/stores/UserStore';
import { useForm } from 'react-hook-form';

// Root marco al usuario con must_change_password: no se puede cerrar hasta que cambie su contraseña.
// Solo es aviso de pulse; connect no bloquea la API.
export function ForcePasswordChangeModal() {
  const { user, reloadConfig } = useConfigStore();
  const { updateUserPassword, saving } = useUserStore();
  const { register, handleSubmit, reset } = useForm();

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
              <input type="password" id="force-password" autoComplete="new-password" {...register('password', { required: true })} className="input" />
            </div>
            <div className="w-full px-3 mb-2">
              <label htmlFor="force-password-confirm" className="input-label">Repetir contraseña *</label>
              <input type="password" id="force-password-confirm" autoComplete="new-password" {...register('password_confirmation', { required: true })} className="input" />
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
