'use client'
import { DateRangeValues } from '@/components/button/DateRange';
import { postForPrint } from '@/services/OtherServices';
import accountReceivableStore from '@/stores/accounts/accountReceivableStore';
import useConfigStore from '@/stores/configStore';
import useTempStorage from '@/stores/useTempStorage';
import { useCallback, useEffect } from 'react';
import { usePutRequest } from '../request/usePutRequest';
import { useDownloadLink } from '../useDownloadLink';

export function useAccountReceivableLogic(currentPage?: any, initialLoad: boolean = false) {
  const { loadAccounts, createPayment, error, checkIn } = accountReceivableStore();
  const { getElement } = useTempStorage();
  const selectedOption = getElement("optionSelected");
  const contactSelected = getElement('clientSelectedBySearch');
  const receivableRecord = getElement('paymentReceivableAdd');
  const { responseData: putData, loading: putLoading, putRequest } = usePutRequest() as { responseData: any; loading: boolean; putRequest: any };
  const { links, addLink } = useDownloadLink();

  const { activeConfig, system } = useConfigStore();


  useEffect(() => { 
          if (initialLoad && selectedOption) {
            loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`);
            }
  }, [currentPage, loadAccounts, contactSelected, selectedOption, initialLoad]);


    const savePayment = async (data: any) => {

      data.status = 1;
      data.account_type = 1;
      data.creditSelected = receivableRecord?.id;
      const success = await createPayment("accounts/payment", data); 
      if (success) {
            loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`)
    }
  }


    const handleCheckIn = async() => {
      const success = await checkIn("accounts/checkin", receivableRecord); 
      if (success) {
            loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`)
    }
  }

  const isPrint = async () => {
    try {
      putRequest(`accounts/payment/${receivableRecord?.id}/print`, {});
      if (putData && putData?.type == "successful") {
          if (activeConfig && activeConfig.includes("print-local")) {
            await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', putData.data, false);
          }
      }
    } catch (error) {
      console.error(error);
    } 
  }

  const handleGet = useCallback(async (data: DateRangeValues) => {
    const params = [
      ...(contactSelected?.id ? [{ name: 'client', value: contactSelected.id }] : []),
      ...(selectedOption?.id != 2 ? [{ name: 'status', value: selectedOption?.id }] : []),
    ];
    addLink(data, 'excel/credits/', params, 3, 'Descargar Reporte');
  }, [addLink, contactSelected, selectedOption]);

  return { savePayment, isPrint, handleCheckIn, links, handleGet };
}