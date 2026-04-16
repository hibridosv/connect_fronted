import { LinkUrls } from '@/components/button/LinkList';
import useContactStore from '@/stores/ContactStore';
import useModalStore from '@/stores/modalStorage';
import { useEffect, useMemo } from 'react';

const downloadLinkNames: Record<string, string> = {
  '&filterWhere[is_client]==1': 'Descargar clientes',
  '&filterWhere[is_provider]==1': 'Descargar proveedores',
  '&filterWhere[is_employee]==1': 'Descargar empleados',
  '&filterWhere[is_referred]==1': 'Descargar referidos',
};

export function useContactsLogic(currentPage: string, searchTerm: string, param: string = "") {
  const { loadContacts, deleteContact } = useContactStore();
  const { closeModal } = useModalStore();

  const links: LinkUrls[] = useMemo(() => {
    const name = downloadLinkNames[param] ?? 'Descargar contactos';
    return [{ name, route: `download.excel.contacts&sort=name${param}`, isUrl: true }];
  }, [param]);

  useEffect(() => {
    if (searchTerm === "") {
      loadContacts(`contacts?sort=-created_at&included=employee&filterWhere[status]==1${param}&perPage=25${currentPage}${searchTerm}`);
    } else {
      loadContacts(`contacts?sort=-created_at&included=employee&filterWhere[status]==1${param}&perPage=25&page=1${searchTerm}`);
    }
  }, [loadContacts, currentPage, searchTerm, param]);

  const onDelete = async (id: string) => {
    closeModal('deleteContact');
    try {
      await deleteContact(`contacts/${id}`);
      await loadContacts(`contacts?sort=-created_at&included=employee&filterWhere[status]==1${param}&perPage=25&page=1`);
    } catch (error) {
      console.error(error);
    }
  }

  return { onDelete, links };
}
