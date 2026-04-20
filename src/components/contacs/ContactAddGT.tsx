'use client';
import { useContactsAddGTLogic } from '@/hooks/contacts/useContactsAddGTLogic';
import { Contact } from '@/interfaces/contact';
import useContactStore from '@/stores/ContactStore';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Preset } from '../button/button';
import { getParamString } from './utils';

export interface ContactAddGTProps {
  isShow: boolean;
  record: Contact;
}

export function ContactAddGT(props: ContactAddGTProps) {
  const { isShow, record } = props;
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { register, handleSubmit, setValue } = useForm();
  const { onSubmit } = useContactsAddGTLogic(isShow, record, setValue, getParamString(pageParam));
  const { saving } = useContactStore();

  if (!isShow) return null;

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-wrap -mx-3">

          <div className="w-full px-3 mb-2 flex justify-between">
            <div>
              <input className="bg-lime-600 rounded-full" type="checkbox" {...register('is_client')} />
              <span className="ml-2 font-medium">Cliente</span>
            </div>
            <div>
              <input className="bg-lime-600 rounded-full" type="checkbox" {...register('is_provider')} />
              <span className="ml-2 font-medium">Proveedor</span>
            </div>
            <div>
              <input className="bg-lime-600 rounded-full" type="checkbox" {...register('is_employee')} />
              <span className="ml-2 font-medium">Repartidor</span>
            </div>
            <div>
              <input className="bg-lime-600 rounded-full" type="checkbox" {...register('is_referred')} />
              <span className="ml-2 font-medium">Referido</span>
            </div>
          </div>

          <div className="w-full px-3 mb-2">
            <label htmlFor="name" className="input-label">Nombre completo *</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: true })}
              onBlur={(e) => setValue('taxpayer', e.target.value)}
              className="input"
            />
          </div>

          <div className="w-full md:w-1/2 px-3 mb-2">
            <label htmlFor="id_number" className="input-label">NIT</label>
            <input
              type="text"
              id="id_number"
              {...register('id_number')}
              onBlur={(e) => setValue('document', e.target.value)}
              placeholder="12345678-9"
              className="input"
            />
          </div>

          <div className="w-full md:w-1/2 px-3 mb-2">
            <label htmlFor="phone" className="input-label">Teléfono</label>
            <input
              type="text"
              id="phone"
              {...register('phone')}
              placeholder="1234-5678"
              pattern="(^[a-zA-Z0-9\+\(\)]{8,30}$|^$)"
              className="input"
            />
          </div>

          <div className="w-full px-3 mb-2">
            <label htmlFor="address" className="input-label">Dirección</label>
            <input type="text" id="address" {...register('address')} className="input" />
          </div>

          <div className="w-full px-3 mb-2">
            <label htmlFor="email" className="input-label">Email</label>
            <input type="email" id="email" {...register('email')} className="input" />
          </div>

        </div>

        <div className="w-full uppercase px-2 border-2 rounded-lg text-base font-bold text-center mb-2">Contacto</div>

        <div className="flex flex-wrap -mx-3">

          <div className="w-full px-3 mb-2">
            <label htmlFor="taxpayer" className="input-label">Nombre del contacto</label>
            <input type="text" id="taxpayer" {...register('taxpayer')} className="input" />
          </div>

          <div className="w-full px-3 mb-2">
            <label htmlFor="taxpayer_type" className="input-label">Tipo de contribuyente</label>
            <select defaultValue={1} id="taxpayer_type" {...register('taxpayer_type')} className="input-select">
              <option value="1">Contribuyente</option>
              <option value="2">Pequeño contribuyente</option>
            </select>
          </div>

        </div>

        <div className="flex justify-center mt-4">
          <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
        </div>

      </form>
    </div>
  );
}
