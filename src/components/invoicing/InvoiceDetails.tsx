import { useGetRequest } from "@/hooks/request/useGetRequest";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { getPaymentTypeName, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { InvalidateDocumentPayload } from "@/stores/invoicing/invoiceDetailsStore";
import { Alert } from "../Alert/Alert";
import { NothingHere } from "../NothingHere";
import { InvoiceDetailsSkeleton } from "../skeleton/InvoiceDetailsSkeleton";
import { CreditNotesTable } from "./CreditNotesTable";
import { ReturnsTable } from "./ReturnsTable";

export interface InvoiceDetailsI {
  isLoading: boolean;
  order: any;
  onElectronic?: boolean;
  onDeleteCreditNote?: (id: string, data: InvalidateDocumentPayload) => void;
  isDeletingCreditNote?: boolean;
  onDeleteReturn?: (id: string, data: InvalidateDocumentPayload) => void;
  isDeletingReturn?: boolean;
  showCancelled?: boolean; // la pagina del documento lo muestra en la columna derecha, debajo de "Regresar"
}

/** aviso de documento anulado, con quien lo anulo y cuando (los anulados antes de guardarlo no lo tienen) */
export function DocumentCancelledAlert({ order }: { order: any }) {
  if (order?.status !== 4) return null;
  return (
    <Alert
      type="danger"
      text={`Este Documento ha sido anulado${order?.canceled_by?.name ? ` por ${order.canceled_by.name}` : ''}${order?.canceled_at ? ` el ${formatDateAsDMY(order.canceled_at)} a las ${formatHourAsHM(order.canceled_at)}` : ''}.`}
    />
  );
}
const InfoCard = ({ title, value }: { title: string; value: string | undefined }) => (
  <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-3 flex flex-col items-center justify-center text-center">
    <span className="text-sm text-text-muted font-semibold uppercase tracking-wider">{title}</span>
    <span className="text-lg font-bold text-text-base mt-1">{value || '--'}</span>
  </div>
);

export function InvoiceDetails(props: InvoiceDetailsI) {
  const { isLoading, order, onElectronic, onDeleteCreditNote, isDeletingCreditNote = false, onDeleteReturn, isDeletingReturn = false, showCancelled = true } = props;
  const { system, activeConfig } = useConfigStore();
  const showCodeStatus = activeConfig && activeConfig.includes("sales-show-code");
  const { getRequest, loading: loadingRequest } = useGetRequest();
    
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
            <CreditNotesTable
              creditnotes={order.creditnotes}
              orderStatus={order.status}
              onDeleteCreditNote={onDeleteCreditNote}
              isDeletingCreditNote={isDeletingCreditNote}
              isElectronic={order?.invoice_assigned?.is_electronic === 1}
            />
          )}

          {order?.returns?.length > 0 && (
            <ReturnsTable
              returns={order.returns}
              orderStatus={order.status}
              onDeleteReturn={onDeleteReturn}
              isDeletingReturn={isDeletingReturn}
            />
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
            {showCancelled && <DocumentCancelledAlert order={order} />}
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