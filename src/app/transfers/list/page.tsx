'use client';
import { DateRange, DateRangeValues } from "@/components/button/DateRange";
import { LinksList } from "@/components/button/LinkList";
import { HistoryTransfersTable } from "@/components/history/HistoryTransfersTable";
import { ToasterMessage } from "@/components/toaster-message";
import { TransferDetailsModal } from "@/components/transfers/TransferDetailsModal";
import { ViewTitle } from "@/components/ViewTitle";
import { useHistorySalesLogic } from "@/hooks/history/useHistorySalesLogic";
import useModalStore from "@/stores/modalStorage";
import useTempStorage from "@/stores/useTempStorage";
import { useTransferSendLogic } from '@/hooks/transfers/useTransferSendLogic';
import { useState } from "react";


export default function Page() {
  const { history, handleGet, loading, links } = useHistorySalesLogic('histories/transfers', 'download.excel.transfers');
  const isLoading = loading.history ?? false;
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const [type, setType] = useState('all');

   const {
      linkedSystems,
    } = useTransferSendLogic();

const fieldsFiltered = [
  {
    name: 'tenantId',
    label: 'Seleccione sucursal',
    type: 'select' as const,
    options: [
      { value: '0', label: 'Mostrar Todos' },...(linkedSystems ?? []).map((system: any) => ({
        value: system.to_tenant_id,
        label: system.to.description,
      }))
    ]
  }
];

const optionsRadioButton = [
  { id: 'all', name: 'Todas' },
  { id: 'sent', name: 'Enviadas' },
  { id: 'received', name: 'Recibidas' },
];

const tenantId = linkedSystems?.[0]?.from_tenant_id;

const filteredTransfers = (history ?? []).filter((transfer: any) => {
  if (type === 'sent') {
    return transfer.from_tenant_id === tenantId;
  }

  if (type === 'received') {
    return transfer.to_tenant_id === tenantId;
  }

  return true;
});

  const handleFormSubmit = async (values: DateRangeValues) => {
    await handleGet(values, 'histories/transfers', 'download.excel.transfers');
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Listado de transferencias" />
        <div className="p-4">
          <HistoryTransfersTable records={filteredTransfers} isLoading={isLoading} />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="Seleccionar fechas" />
          <div className="mt-2 p-2">
            <DateRange onSubmit={handleFormSubmit} loading={isLoading} additionalFields={fieldsFiltered}  />
          </div>
          <div className="flex flex-wrap justify-center p-2 rounded-lg bg-bg-subtle/30">
            {optionsRadioButton.map((option) => (
              <label
                key={option.id}
                className="flex items-center cursor-pointer px-3 py-2 rounded-md transition-colors duration-200 hover:bg-bg-subtle"
              >
                <input
                  type="radio"
                  name="transferType"
                  value={option.id}
                  checked={type === option.id}
                  onChange={() => setType(option.id)}
                  className="hidden peer"
                />

                <span className="w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 peer-checked:border-primary peer-checked:bg-primary peer-checked:after:block peer-checked:after:w-2 peer-checked:after:h-2 peer-checked:after:rounded-full peer-checked:after:bg-text-inverted peer-checked:after:content-[''] border-text-muted"></span>

                <span className="text-text-base peer-checked:text-primary font-medium">
                  {option.name}
                </span>
              </label>
            ))}
          </div>

          <div className="p-4">
            <LinksList links={links} text="DESCARGAS" />
          </div>
    </div> 
    <TransferDetailsModal
      isShow={modals['historyTransferDetails'] ?? false}
      transfer={getElement('historySelectedTransfer')}
      onClose={() => closeModal('historyTransferDetails')}
    />
    <ToasterMessage />
</div>
  );
}
