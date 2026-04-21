import { useGetRequest } from "@/hooks/request/useGetRequest";
import { formatDateAsDMY } from "@/lib/date-formats";
import { getPaymentTypeName, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { Alert } from "../Alert/Alert";
import { NothingHere } from "../NothingHere";
import { InvoiceDetailsSkeleton } from "../skeleton/InvoiceDetailsSkeleton";

export interface InvoiceDetailsI {
  isLoading: boolean;
  order: any;
  onElectronic?: boolean;
}

const InfoCard = ({ title, value }: { title: string; value: string | undefined }) => (
  <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-3 flex flex-col items-center justify-center text-center">
    <span className="text-sm text-text-muted font-semibold uppercase tracking-wider">{title}</span>
    <span className="text-lg font-bold text-text-base mt-1">{value || '--'}</span>
  </div>
);

export function InvoiceDetails(props: InvoiceDetailsI) {
    const { isLoading, order, onElectronic } = props;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 space-y-2 text-sm">
              <h3 className="font-bold text-text-base mb-2">Información Adicional</h3>
              {order?.client && <div><span className="text-text-muted">Cliente:</span> <span className="font-semibold">{order.client.name}</span></div>}
              {order?.employee && <div><span className="text-text-muted">Atendido por:</span> <span className="font-semibold">{order.employee.name}</span></div>}
              {order?.referred && <div><span className="text-text-muted">Referido:</span> <span className="font-semibold">{order.referred.name}</span></div>}
              {order?.delivery && <div><span className="text-text-muted">Repartidor:</span> <span className="font-semibold">{order.delivery.name}</span></div>}
            </div>
            <div className="space-y-3">
              {order?.invoice_assigned?.type === 9 && <Alert text="Este Documento tiene una numeración temporal." />}
              {order?.invoice_assigned?.is_electronic === 1 && 
              <div>
                <Alert text="Este Documento se envió electrónicamente." />
                <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2 my-2 text-sm ">
                  <span className="text-text-muted"> Código de generación:</span> 
                <span className="uppercase font-semibold"> {order.id}</span></div>
              </div>}
              {order?.status === 4 && <Alert text="Este Documento ha sido anulado." type="danger" />}
            </div>
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