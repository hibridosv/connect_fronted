import useInvoiceDetailsStore, { InvalidateDocumentPayload } from '@/stores/invoicing/invoiceDetailsStore';
import { useEffect } from 'react';


export function useInvoiceDetailsLogic(invoiceId: string, isShow: boolean) {
    const {
        order,
        error,
        loadingOrder,
        printing,
        deleting,
        deletingCreditNote,
        fetchOrder,
        printOrder,
        deleteOrder,
        deleteCreditNote,
    } = useInvoiceDetailsStore();

    useEffect(() => {
        if (isShow && invoiceId) {
            fetchOrder(invoiceId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceId, isShow]);

    return {
        order,
        error,
        loadingOrder,
        printing,
        deleting,
        deletingCreditNote,
        printOrder,
        deleteOrder: (id: string, data: InvalidateDocumentPayload) => deleteOrder(id, invoiceId, data),
        deleteCreditNote: (creditNoteId: string, data: InvalidateDocumentPayload) => deleteCreditNote(creditNoteId, invoiceId, data),
    };
}
