import { getFirstElement } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import purchasesStore from '@/stores/reports/purchasesStore';
import { useEffect } from 'react';


export function usePurchasesLogic(selectedBookId: string | null) {
    const { loadPurchases, loadInvoices, purchases, deleteInvoice } = purchasesStore()
    const { client } = useConfigStore();

    useEffect(() => {
        if (client) {
            loadPurchases(`purchases?filterWhere[nit]==${client?.nit}&sort=-created_at`);
        }
    }, [loadPurchases, client]);

    useEffect(() => {
        if (purchases) {
            const id = selectedBookId ?? getFirstElement(purchases)?.id;
            loadInvoices(`purchases/${id}/invoices`);
        }
    }, [loadInvoices, purchases, selectedBookId]);


    const handleDelete = async () => {
        const success = await deleteInvoice(`purchases/${selectedBookId}/invoices`);
        if (success) {
            loadInvoices(`purchases/${selectedBookId}/invoices`);
        }
    }
    
    return { handleDelete }
}
