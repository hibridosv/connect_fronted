'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { buildPhoneNumber, formatPhoneDisplay, PHONE_COUNTRY_CODES } from '@/lib/phone';
import { getServices } from '@/services/services';
import useUserStore from '@/stores/UserStore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRobot, FaWhatsapp } from 'react-icons/fa';

interface EditUserModalProps {
  isShow: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (userId: string, currentUser: any, data: any) => Promise<boolean>;
}

export function EditUserModal({ isShow, onClose, user, onSubmit }: EditUserModalProps) {
  const { saving } = useUserStore();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [loadingPhone, setLoadingPhone] = useState(false);

  useEffect(() => {
    if (isShow && user) {
      setValue('name', user.name);
      setValue('country_code', PHONE_COUNTRY_CODES[0].code);
      setValue('phone_local', '');

      setLoadingPhone(true);
      getServices(`users/${user.id}/phone_number`)
        .then((res) => setCurrentPhone(res.data?.data?.phone_number ?? null))
        .catch(() => setCurrentPhone(null))
        .finally(() => setLoadingPhone(false));
    }
  }, [isShow, user, setValue]);

  const handleFormSubmit = async (data: any) => {
    const success = await onSubmit(user.id, user, {
      name: data.name,
      phone_number: buildPhoneNumber(data.country_code, data.phone_local),
    });
    if (success) reset();
  };

  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="Editar usuario">
      <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
          <div className="flex flex-wrap mb-4">
            <div className="w-full px-3 mb-2">
              <label htmlFor="edit-user-name" className="input-label">Nombre *</label>
              <input type="text" id="edit-user-name" {...register('name', { required: true })} className="input" />
            </div>

            <div className="w-full px-3 mb-2">
              <label htmlFor="edit-user-phone" className="input-label">
                Número de WhatsApp
              </label>

              {loadingPhone ? (
                <div className="text-xs text-text-muted mb-2">Buscando número registrado...</div>
              ) : currentPhone ? (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-success/10 text-success text-sm font-medium w-fit">
                    <FaWhatsapp size={16} />
                    {formatPhoneDisplay(currentPhone)}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/10 text-info text-[10px] font-semibold uppercase tracking-wide">
                    <FaRobot size={10} />
                    Usuario del chatbot
                  </span>
                </div>
              ) : (
                <div className="text-xs text-text-muted mb-2">Sin número de WhatsApp registrado</div>
              )}

              <div className="flex gap-2">
                <div className="w-40 shrink-0">
                  <select id="edit-user-phone-code" {...register('country_code')} className="input-select">
                    {PHONE_COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} +{country.code}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="tel"
                  id="edit-user-phone"
                  placeholder="Ej. 60625689"
                  {...register('phone_local')}
                  className="input flex-1 min-w-0"
                />
              </div>
              <p className="text-xs text-text-muted mt-1">Déjalo vacío si no deseas modificarlo.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={saving} />
      </Modal.Footer>
    </Modal>
  );
}
