'use client';
import { formatDocument, formatDuiWithAll } from '@/lib/utils';
import useContactStore from '@/stores/ContactStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';

export function useContactsAddGTLogic(isShow: boolean, record: any, setValue: any, param: string = '') {
  const { createContact, loadContacts, updateContact } = useContactStore();
  const { getElement, clearElement } = useTempStorage();

  useEffect(() => {
    if (record && isShow) {
      setValue('is_client', record.is_client);
      setValue('is_provider', record.is_provider);
      setValue('is_employee', record.is_employee);
      setValue('is_referred', record.is_referred);
      setValue('name', record.name);
      setValue('id_number', formatDuiWithAll(record.id_number));
      setValue('phone', record.phone);
      setValue('address', record.address);
      setValue('email', record.email);
      setValue('taxpayer', record.taxpayer);
      setValue('taxpayer_type', record.taxpayer_type);
    }
  }, [isShow, record, setValue]);

  const onSubmit = async (data: any) => {
    if (!data.is_client && !data.is_provider && !data.is_employee && !data.is_referred) {
      useToastMessageStore.getState().setError({ message: 'Debe elegir el tipo de contacto' });
      return false;
    }

    data.id_number = formatDocument(data.id_number);
    data.document = formatDocument(data.id_number);
    data.register = formatDocument(data.register);

    try {
      if (record) {
        await updateContact(`contacts/${record.id}`, data);
      } else {
        await createContact(data);
      }
      const url = getElement('isFromProducts')
        ? 'contacts?sort=-created_at&filterWhere[is_provider]==1&perPage=100&page=1'
        : `contacts?sort=-created_at&included=employee&filterWhere[status]==1${param}&perPage=25&page=1`;
      await loadContacts(url);
      clearElement('isFromProducts');
    } catch (error) {
      console.error(error);
    }
  };

  return { onSubmit };
}
