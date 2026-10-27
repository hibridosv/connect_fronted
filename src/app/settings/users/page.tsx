'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ViewTitle } from '@/components/ViewTitle';
import { Button, Preset } from '@/components/button/button';
import { UsersTable } from '@/components/settings/UsersTable';
import { EditUserModal } from '@/components/settings/EditUserModal';
import { EditUserPasswordModal } from '@/components/settings/EditUserPasswordModal';
import { EditUserRoleModal } from '@/components/settings/EditUserRoleModal';
import { DeleteModal } from '@/components/DeleteModal';
import { ToasterMessage } from '@/components/toaster-message';
import { useUsersLogic } from '@/hooks/settings/useUsersLogic';
import { buildPhoneNumber, PHONE_COUNTRY_CODES } from '@/lib/phone';
import useModalStore from '@/stores/modalStorage';
import useConfigStore from '@/stores/configStore';
import { canViewRole } from '@/app/settings/utils';
import useTempStorage from '@/stores/useTempStorage';
import { FaUser, FaUsers, FaWhatsapp } from 'react-icons/fa';

const PHONE_ELIGIBLE_TYPES = ['Gerencia', 'Administracion'];

interface NewUserFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: string;
  country_code: string;
  phone_local: string;
}

export default function Page() {
  const { register, handleSubmit, reset, watch, setValue } = useForm<NewUserFormValues>({
    defaultValues: { type: 'Gerencia', country_code: PHONE_COUNTRY_CODES[0].code },
  });
  const { onCreateUser, onDeleteUser, onUpdateUser, onUpdatePassword, onUpdateRole, userType, saving } = useUsersLogic();
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const [showAll, setShowAll] = useState(false);
  const { role } = useConfigStore();

  // el servidor no deja crear usuarios de un rol superior (RoleHierarchy)
  const typeOptions = ['Gerencia', 'Administracion', 'Cajero', userType, 'Contador'].filter((t) => canViewRole(role ?? '', t));
  const defaultType = typeOptions[0] ?? '';

  useEffect(() => {
    setValue('type', defaultType);
  }, [defaultType, setValue]);

  const selectedType = watch('type');
  const isPhoneEligible = PHONE_ELIGIBLE_TYPES.includes(selectedType);

  const onSubmit = async (data: any) => {
    const success = await onCreateUser({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      type: data.type,
      phone_number: isPhoneEligible ? buildPhoneNumber(data.country_code, data.phone_local) : '',
    });
    if (success) reset({ type: defaultType, country_code: PHONE_COUNTRY_CODES[0].code });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
      <div className="md:col-span-4 md:border-r md:border-primary">
        <ViewTitle text="Ingresar Usuario" />
        <div className="mx-4">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3 mb-3">
                <label htmlFor="name" className="input-label">Nombre *</label>
                <input type="text" id="name" placeholder="Nombre completo" {...register('name')} className="input" />
              </div>

              <div className="w-full px-3 mb-3">
                <label htmlFor="email" className="input-label">Email *</label>
                <input type="email" id="email" placeholder="usuario@hibridosv.com" {...register('email')} className="input" />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="password" className="input-label">Password *</label>
                <input type="password" id="password" {...register('password')} className="input" />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-3">
                <label htmlFor="password_confirmation" className="input-label">Repetir Password *</label>
                <input type="password" id="password_confirmation" {...register('password_confirmation')} className="input" />
              </div>

              <div className="w-full px-3 mb-3">
                <label htmlFor="type" className="input-label">Tipo de usuario *</label>
                <select id="type" {...register('type')} className="input-select">
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {isPhoneEligible && (
                <div className="w-full px-3 mb-3">
                  <label htmlFor="phone_local" className="input-label">
                    Número de WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <div className="w-40 shrink-0">
                      <select id="country_code" {...register('country_code')} className="input-select">
                        {PHONE_COUNTRY_CODES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} +{country.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="tel"
                      id="phone_local"
                      placeholder="Ej. 60625689"
                      {...register('phone_local')}
                      className="input flex-1 min-w-0"
                    />
                  </div>
                  <p className="flex items-center gap-1 text-xs text-text-muted mt-1">
                    <FaWhatsapp className="text-success shrink-0" size={12} />
                    Solo para Gerencia y Administración — habilita al usuario en el chatbot.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
            </div>
          </form>
        </div>
      </div>

      <div className="md:col-span-6">
        <div className="flex justify-between items-center">
          <ViewTitle text="Listado de Usuarios" />
          <div className="flex rounded-lg border border-bg-subtle overflow-hidden bg-bg-content shrink-0 mr-4">
            <button
              onClick={() => setShowAll(false)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${!showAll ? 'bg-primary text-text-inverted' : 'text-text-muted hover:bg-bg-subtle'}`}
            >
              <FaUser size={11} />
              Activos
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${showAll ? 'bg-primary text-text-inverted' : 'text-text-muted hover:bg-bg-subtle'}`}
            >
              <FaUsers size={11} />
              Todos
            </button>
          </div>
        </div>
        <div className="px-4">
          <UsersTable showAll={showAll} />
        </div>
      </div>

      <EditUserModal
        isShow={!!modals.editUser}
        onClose={() => closeModal('editUser')}
        user={getElement('editUser')}
        onSubmit={onUpdateUser}
      />

      <EditUserPasswordModal
        isShow={!!modals.editUserPassword}
        onClose={() => closeModal('editUserPassword')}
        user={getElement('editUserPassword')}
        onSubmit={onUpdatePassword}
      />

      <EditUserRoleModal
        isShow={!!modals.editUserRole}
        onClose={() => closeModal('editUserRole')}
        user={getElement('editUserRole')}
        onSubmit={onUpdateRole}
      />

      <DeleteModal
        isShow={!!modals.deleteUser}
        text="¿Estás seguro de eliminar este usuario?"
        header="Eliminar Usuario"
        onDelete={() => onDeleteUser(getElement('deleteUser')?.id)}
        onClose={() => closeModal('deleteUser')}
      />

      <ToasterMessage />
    </div>
  );
}
