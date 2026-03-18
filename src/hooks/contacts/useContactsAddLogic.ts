import { formatDocument, formatDuiWithAll } from '@/lib/utils';
import useContactStore from '@/stores/ContactStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import useUserStore from '@/stores/UserStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect } from 'react';


export function useContactsAddLogic(isShow: boolean, record:any, setValue:any, departaments: any, countries: any, town: any, param: string = "") {
  const { createContact, loadContacts, updateContact } = useContactStore();
  const { loadUsers } = useUserStore();
    const { getElement, clearElement } = useTempStorage();


  useEffect(() => {
    if (record && isShow) {
        setValue("is_client", record.is_client);
        setValue("is_provider", record.is_provider);
        setValue("is_employee", record.is_employee);
        setValue("is_referred", record.is_referred);
        setValue("name", record.name);
        setValue("id_number", formatDuiWithAll(record.id_number));
        setValue("phone", record.phone);
        setValue("address", record.address);
        setValue("email", record.email);
        setValue("code", record.code);
        setValue("birthday", record.birthday);
        setValue("taxpayer", record.taxpayer);
        setValue("document", formatDuiWithAll(record.document));
        setValue("register", formatDuiWithAll(record.register));
        setValue("roar", record.roar);
        setValue("address_doc", record.address_doc);
        setValue("taxpayer_type", record.taxpayer_type);
        setValue("is_credit_block", record.is_credit_block);
        setValue("excluded", record.excluded);
        setValue("employee_id", record.employee_id);
    }
  }, [isShow, record, setValue]);

 useEffect(() => {
    if (record && isShow) {
        setValue("departament_doc", record.departament_doc);      
        setValue("country", record.country);
    }
}, [isShow, record, setValue, departaments, countries]);

useEffect(() => {
    if (record && isShow) {
        setValue("town_doc", `${record.departament_doc}${record.town_doc}`);
    }
}, [isShow, record, setValue, town]);


  useEffect(() => {
    if (isShow) {
        loadUsers(`users?included=roles&filterWhere[is_visible]==1&sort=-created_at`);
    }
  }, [isShow, loadUsers]);


  const onSubmit = async (data: any) => {
      if (!data.is_client && !data.is_provider && !data.is_employee && !data.is_referred) {
          useToastMessageStore.getState().setError({ message: "Debe elegir el tipo de contacto"});
          return false; }

    data.id_number = formatDocument(data.id_number ? data.id_number : data.document) // se registra sin guiones
    data.document = formatDocument(data.document ? data.document : data.id_number) // se registra sin guiones
    data.register = formatDocument(data.register) // se registra sin guiones
    data.town_doc =  data.town_doc.slice(-2);

    try {
        if (record) {
            await updateContact(`contacts/${record.id}`, data);
        } else {
            await createContact(data);
        }
        let url = '';
        if (getElement('isFromProducts')) {
            url = 'contacts?sort=-created_at&filterWhere[is_provider]==1&perPage=100&page=1';
        } else {
            url = `contacts?sort=-created_at&included=employee&filterWhere[status]==1${param}&perPage=25&page=1`;
        }
        await loadContacts(url);
        clearElement('isFromProducts');
    } catch (error) {
        console.error(error);
    }
};

  return { onSubmit };

}
