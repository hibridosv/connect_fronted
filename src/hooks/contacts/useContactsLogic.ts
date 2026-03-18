import useContactStore from '@/stores/ContactStore';
import useModalStore from '@/stores/modalStorage';
import { useEffect } from 'react';


export function useContactsLogic(currentPage: string, searchTerm: string, param: string = "") {
  const { loadContacts, deleteContact } = useContactStore();
  const { closeModal} = useModalStore();



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

    return { onDelete };
}
