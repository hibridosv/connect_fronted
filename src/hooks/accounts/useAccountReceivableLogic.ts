'use client'
import { DateRangeValues } from '@/components/button/DateRange';
import { dueInstallments, isInstallments, payoffAmount } from '@/components/accounts/utils';
import { permissionExists } from '@/lib/utils';
import { postForPrint } from '@/services/OtherServices';
import accountReceivableStore from '@/stores/accounts/accountReceivableStore';
import useConfigStore from '@/stores/configStore';
import useTempStorage from '@/stores/useTempStorage';
import { useCallback, useEffect } from 'react';
import { usePutRequest } from '../request/usePutRequest';
import { useDownloadLink } from '../useDownloadLink';

export function useAccountReceivableLogic(currentPage?: any, initialLoad: boolean = false) {
  const { loadAccounts, createPayment, waiveLateFee, restructureCredit, error } = accountReceivableStore();
  const { getElement } = useTempStorage();
  const selectedOption = getElement("optionSelected");
  const contactSelected = getElement('clientSelectedBySearch');
  const receivableRecord = getElement('paymentReceivableAdd');
  const { putRequest, responseData, loading } = usePutRequest() as any;
  const { links, addLink } = useDownloadLink();

  const { activeConfig, system, permission } = useConfigStore();
  const canWaiveLateFee = permissionExists(permission, 'credits-waive-late-fee');
  const canRestructure = permissionExists(permission, 'credits-restructure');


  useEffect(() => { 
          if (initialLoad && selectedOption) {
            loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client,installments&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`);
            }
  }, [currentPage, loadAccounts, contactSelected, selectedOption, initialLoad]);


    const savePayment = async (data: any) => {

      data.status = 1;
      data.account_type = 1;
      data.creditSelected = receivableRecord?.id;
      const success = await createPayment("accounts/payment", data); 
      if (success) {
            loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client,installments&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`)
    }
  }


  const isPrint = async () => {
    try {
      await putRequest(`accounts/payment/${receivableRecord?.id}/print`, {});
      if (responseData && responseData?.type == "successful") {
          if (activeConfig && activeConfig.includes("print-local")) {
            const printResponse = await postForPrint(system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', responseData.data);
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
    addLink(data, 'download.excel.credits', params, 3, 'Descargar Reporte');
  }, [addLink, contactSelected, selectedOption]);

  const handleWaiveLateFee = async (installmentId: string) => {
    const success = await waiveLateFee(`accounts/receivable/installments/${installmentId}/waive-late-fee`);
    if (success) {
      loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client,installments&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`);
    }
  }

  const handleRestructure = async (data: any) => {
    const success = await restructureCredit(`accounts/receivable/${receivableRecord?.id}/restructure`, data);
    if (success) {
      loadAccounts(`accounts/receivable?included=order.products,order.invoiceAssigned,employee,payments.employee,payments.deletedBy,client,installments&${selectedOption?.id != 2 ? `filterWhere[status]==${selectedOption?.id}&`:``}${contactSelected?.id ? `filterWhere[client_id]==${contactSelected.id}&` : ``}sort=-created_at&perPage=10${currentPage ? currentPage : ''}`);
    }
    return success;
  }

  const installments = isInstallments(receivableRecord);
  const due = dueInstallments(receivableRecord);
  const payoff = installments ? payoffAmount(receivableRecord) : Number(receivableRecord?.balance ?? 0);

  return { savePayment, isPrint, links, handleGet, installments, due, payoff, canWaiveLateFee, handleWaiveLateFee, canRestructure, handleRestructure };
}