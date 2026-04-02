import { postForPrint } from '@/services/OtherServices';
import { createService, getServices } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import useModalStore from '@/stores/modalStorage';
import useStateStore from '@/stores/stateStorage';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react';


export function useInvoiceDetailsLogic(invoiceId: string, isShow: boolean) {
    const [order, setOrder] = useState(null) as any;
    const { openLoading, closeLoading, loading } = useStateStore();
    const { setError, setMessage } = useToastMessageStore();
    const { system, activeConfig } = useConfigStore();
    const { closeModal } = useModalStore();

    
    const fetchOrder = async (invoiceId: string) => {
            openLoading("getOrder");
            try {
                const iden = invoiceId.toLowerCase();
                const url = `orders/find?filter[id]==${iden}&included=products,invoiceproducts,employee,client,referred,delivery,casheir,invoiceAssigned`;
                const response = await getServices(url);
                setOrder(response.data.data);
            } catch (error) {
                console.error('Error fetching data', error);
                setOrder(null);
            } finally {
                closeLoading("getOrder");
            }
    };
    
    
      const printOrder = async (id: string) => {
        try {
          openLoading("printing")
          const response = await createService(`documents/print`, { invoice: id });
          if (response.status === 200) {
            if (activeConfig && activeConfig.includes("print-local")) {
              await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', response.data.data);
            }
            setMessage(response)
          }
        } catch (error) {
          setError(error)
        } finally {
          closeLoading("printing");
        }
      };
    
      const deleteOrder = async (id: string, onSuccess?: () => void) => {
        closeModal('deleteOrder')
        openLoading("deleting");
        try {
          const response = await createService(`documents/delete`, { invoice: id });
          if (response.status === 200 || response.status === 204) {
            setMessage({ message: "Orden anulada correctamente" });
             fetchOrder(id);
          }
        } catch (error) {
          setError(error);
        } finally {
          closeLoading("deleting");
        }
      };


    useEffect(() => {
        if (isShow && invoiceId) {
            fetchOrder(invoiceId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceId, isShow, openLoading, closeLoading]);

    return { order, loading, printOrder, deleteOrder };
}
