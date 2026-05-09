import { useGetRequest } from "@/hooks/request/useGetRequest";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Alert } from "../Alert/Alert";
import { DeleteModal } from "../DeleteModal";
import { NothingHere } from "../NothingHere";
import { InvoiceDetailsSkeleton } from "../skeleton/InvoiceDetailsSkeleton";

export interface InvoiceDetailsI {
  isLoading: boolean;
  order: any;
  onElectronic?: boolean;
  onDeleteCreditNote?: (id: string) => void;
  isDeletingCreditNote?: boolean;
}

const InfoCard = ({ title, value }: { title: string; value: string | undefined }) => (
  <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-3 flex flex-col items-center justify-center text-center">
    <span className="text-sm text-text-muted font-semibold uppercase tracking-wider">{title}</span>
    <span className="text-lg font-bold text-text-base mt-1">{value || '--'}</span>
  </div>
);

export function InvoiceDetails(props: InvoiceDetailsI) {
    const { isLoading, order, onElectronic, onDeleteCreditNote, isDeletingCreditNote = false } = props;
    const { system, activeConfig, client } = useConfigStore();
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
    const showCodeStatus = activeConfig && activeConfig.includes("sales-show-code");
    const { getRequest, loading: loadingRequest } = useGetRequest();
    const [selectedCreditNoteId, setSelectedCreditNoteId] = useState<string | null>(null);

    
  if (!order) return <NothingHere text="No se encontro esta orden... " />;

  const listProducts = order?.products.map((record: any) => (
    <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-4 py-2 text-center">{record?.quantity}</td>
      {showCodeStatus && <td className="px-4 py-2">{record?.cod}</td>}
      <td className="px-4 py-2 font-medium">{record?.product}</td>
      <td className="px-4 py-2 text-right">{numberToMoney(record?.unit_price || 0, system)}</td>
      <td className="px-4 py-2 text-right">{numberToMoney(record?.subtotal || 0, system)}</td>
      <td className="px-4 py-2 text-right">{numberToMoney(record?.taxes || 0, system)}</td>
      <td className="px-4 py-2 text-right">{numberToMoney(record?.discount || 0, system)}</td>
      <td className="px-4 py-2 text-right font-bold">{numberToMoney(record?.total || 0, system)}</td>
    </tr>
  ));

  return (
        <div className="p-4 bg-bg-base text-text-base space-y-6">
          { isLoading ? <InvoiceDetailsSkeleton /> : order ?  <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard title="Cajero" value={order?.employee?.name} />
            <InfoCard title="Fecha" value={formatDateAsDMY(order?.charged_at)} />
            <InfoCard title="Tipo Doc." value={order?.invoice_assigned?.name} />
            <InfoCard title="Forma de Pago" value={getPaymentTypeName(order?.payment_type)} />
          </div>

          <div className="w-full overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
                <tr className="border-b-2 border-bg-subtle">
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-center">Cant</th>
                  {showCodeStatus && <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Código</th>}
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle">Producto</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-right">Precio</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-right">Subtotal</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-right">Imp</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider border-r border-bg-subtle text-right">Desc</th>
                  <th scope="col" className="px-4 py-3 font-bold tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle">
                {listProducts}
                <tr className="border-t-2 border-bg-subtle bg-bg-subtle/60 font-bold">
                  <td colSpan={showCodeStatus ? 4 : 3} className="px-4 py-2 text-right uppercase">Totales</td>
                  <td className="px-4 py-2 text-right">{numberToMoney(order?.subtotal, system)}</td>
                  <td className="px-4 py-2 text-right">{numberToMoney(order?.taxes, system)}</td>
                  <td className="px-4 py-2 text-right">{numberToMoney(order?.discount, system)}</td>
                  <td className="px-4 py-2 text-right">{numberToMoney(order?.total, system)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {order?.creditnotes?.length > 0 && (
            <div className="space-y-2">
              <Alert text={`Este documento contiene ${order.creditnotes.length} nota${order.creditnotes.length > 1 ? 's' : ''} de crédito.`} type="warning" />
              <div className="w-full overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
                    <tr className="border-b-2 border-bg-subtle">
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">ID</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle text-center">Número</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Fecha</th>
                      <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle text-right">Total</th>
                      {onDeleteCreditNote && <th scope="col" className="px-3 py-2 font-bold tracking-wider text-center">Anular</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bg-subtle">
                    {order.creditnotes.map((creditnote: any) => (
                      <tr key={creditnote.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
                        <td className="px-3 py-1 font-mono text-xs uppercase">
                          <a href={`${API_URL}documents/download/pdf/${creditnote.id}/${client?.id}`} target="_blank" title="Descargar PDF" className="text-primary hover:underline">{creditnote.id}</a>
                        </td>
                        <td className="px-3 py-1 text-center">{creditnote.invoice}</td>
                        <td className="px-3 py-1 whitespace-nowrap">{formatDateAsDMY(creditnote.emited_at)} {formatHourAsHM(creditnote.emited_at)}</td>
                        <td className="px-3 py-1 text-right font-bold">{numberToMoney(creditnote.total, system)}</td>
                        {onDeleteCreditNote && (
                          <td className="px-3 py-1 text-center">
                            <button
                              title="Anular nota de crédito"
                              disabled={isDeletingCreditNote || order?.status !== 3}
                              onClick={() => setSelectedCreditNoteId(creditnote.id)}
                              className="text-danger hover:text-danger/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 clickeable"
                            >
                              <RiDeleteBin2Line size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr className="border-t-2 border-bg-subtle bg-bg-subtle/60 font-bold">
                      <td colSpan={3} className="px-3 py-1 text-right uppercase text-xs">Total</td>
                      <td className="px-3 py-1 text-right">{numberToMoney(getTotalOfItem(order.creditnotes, 'total'), system)}</td>
                      {onDeleteCreditNote && <td />}
                    </tr>
                  </tbody>
                </table>
              </div>
              <DeleteModal
                isShow={!!selectedCreditNoteId}
                header="Anular Nota de Crédito"
                text="¿Estás seguro de anular esta nota de crédito? Esta acción no se puede deshacer."
                textDelete="Sí, Anular"
                isSending={isDeletingCreditNote}
                onDelete={() => {
                  if (selectedCreditNoteId && onDeleteCreditNote) {
                    onDeleteCreditNote(selectedCreditNoteId);
                    setSelectedCreditNoteId(null);
                  }
                }}
                onClose={() => setSelectedCreditNoteId(null)}
              />
            </div>
          )}

          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-3 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
              {order?.client && <>
                <div className="flex gap-1"><span className="text-text-muted shrink-0">Cliente:</span><span className="font-semibold truncate">{order.client.name}</span></div>
                {order.client.document && <div className="flex gap-1"><span className="text-text-muted shrink-0">Documento:</span><span className="font-semibold">{order.client.document}</span></div>}
                {order.client.phone && <div className="flex gap-1"><span className="text-text-muted shrink-0">Teléfono:</span><span className="font-semibold">{order.client.phone}</span></div>}
                {order.client.email && <div className="flex gap-1"><span className="text-text-muted shrink-0">Email:</span><span className="font-semibold truncate">{order.client.email}</span></div>}
              </>}
              {order?.employee && <div className="flex gap-1"><span className="text-text-muted shrink-0">Atendido por:</span><span className="font-semibold">{order.employee.name}</span></div>}
              {order?.referred && <div className="flex gap-1"><span className="text-text-muted shrink-0">Referido:</span><span className="font-semibold">{order.referred.name}</span></div>}
              {order?.delivery && <div className="flex gap-1"><span className="text-text-muted shrink-0">Repartidor:</span><span className="font-semibold">{order.delivery.name}</span></div>}
              {order?.comment && <div className="flex gap-1 md:col-span-3"><span className="text-text-muted shrink-0">Comentario:</span><span className="font-semibold">{order.comment}</span></div>}
            </div>
          </div>

          <div className="space-y-2">
            {order?.invoice_assigned?.type === 9 && <Alert text="Este Documento tiene una numeración temporal." />}
            {order?.invoice_assigned?.is_electronic === 1 && <>
              <Alert text="Este Documento se envió electrónicamente." />
              <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle px-3 py-2 text-xs">
                <span className="text-text-muted">Código de generación:</span>
                <span className="uppercase font-semibold ml-1">{order.id}</span>
              </div>
            </>}
            {order?.status === 4 && <Alert text="Este Documento ha sido anulado." type="danger" />}
          </div>
          {order?.invoice_assigned?.is_electronic === 1 && onElectronic && (
            <div className="text-sm text-text-muted p-3 bg-bg-content rounded-lg border border-bg-subtle">
              Si este documento no se envió electrónicamente, puede reintentarlo 
              <button className="text-primary hover:underline font-semibold ml-2 clickeable" onClick={loadingRequest ? ()=>{} : ()=>getRequest(`electronic/send/${order.id}`)}>
                aquí
              </button>.
              { loadingRequest && <span className="ml-2">Enviando...</span> }
            </div>
          )}
          </> : <NothingHere text="No se encontraron datos del documento" /> }
        </div>
  )
}