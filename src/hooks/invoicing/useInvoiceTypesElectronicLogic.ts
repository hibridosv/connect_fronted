import { AdditionalField } from '@/components/button/DateRange';
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import { useEffect, useMemo, useState } from 'react'; // Import useMemo


export function useInvoiceTypesElectronicLogic(url: string) {
    const [ invoiceTypes, setInvoiceTypes ] = useState(null) as any;
    const { openLoading, closeLoading, loading } = useStateStore()

    useEffect(() => {
        const handleGet = async (url: string) => {
            openLoading("invoiceTypes");
            try {
                const response = await getServices(url);
                setInvoiceTypes(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                closeLoading("invoiceTypes");
            }
        }

        (async () => { 
            await handleGet(url)
        })();
    }, [openLoading, closeLoading, url]);


    const fieldsFiltered: AdditionalField[] = useMemo(() => {
        if (!invoiceTypes) {
            return [];
        }

        const typesFiltered = invoiceTypes.map((type: any) => ({ value: type.type, label: type.name }));

        return [{
            name: 'invoiceId',
            label: 'Seleccione el tipo de documento',
            type: 'select',
            options : [{ value: '', label: 'Mostrar Todos' }, ...typesFiltered]
        }];
    }, [invoiceTypes]);
    

    const Additionalfields: AdditionalField[] = useMemo(() => {
              if (!fieldsFiltered) {
                  return [];
              }
    
              return [ ... fieldsFiltered,
                {
                  name: 'status',
                  label: 'Seleccione el estado del documento',
                  type: 'select',
                  options : [
                    { value: '', label: 'Todos' },
                    { value: '1', label: 'Enviados' },
                    { value: '2', label: 'Firmados' },
                    { value: '3', label: 'Rechazados' },
                    { value: '4', label: 'Procesados' },
                    { value: '5', label: 'Anulados' },
                   ]
              }];
          }, [fieldsFiltered]);


    return { invoiceTypes, loading, Additionalfields }
}