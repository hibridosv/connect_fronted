import { LinkUrls } from '@/components/button/LinkList';
import { get } from '@/services/httpService';
import useContactStore from '@/stores/ContactStore';
import useModalStore from '@/stores/modalStorage';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const downloadLinkNames: Record<string, string> = {
  '&filterWhere[is_client]==1': 'Descargar clientes',
  '&filterWhere[is_provider]==1': 'Descargar proveedores',
  '&filterWhere[is_employee]==1': 'Descargar empleados',
  '&filterWhere[is_referred]==1': 'Descargar referidos',
};

export function useContactsLogic(currentPage: string, searchTerm: string, param: string = "") {
  const { loadContacts, deleteContact } = useContactStore();
  const { closeModal } = useModalStore();
  const { data: session } = useSession();
  const remoteUrl = session?.url;
  const [links, setLinks] = useState<LinkUrls[]>([]);

  useEffect(() => {
    if (!remoteUrl) return;

    const name = downloadLinkNames[param] ?? 'Descargar contactos';
    const filterParam = param ?? '';

    setLinks([{ name, link: '', isUrl: true, loading: true }]);

    get(`config/url?route=download.excel.contacts&sort=name${filterParam}`)
      .then(response => {
        const resolvedUrl = response.data?.url;
        setLinks([{ name, link: resolvedUrl ?? '', isUrl: true, loading: false }]);
      })
      .catch(() => {
        setLinks([]);
      });
  }, [remoteUrl, param]);

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
