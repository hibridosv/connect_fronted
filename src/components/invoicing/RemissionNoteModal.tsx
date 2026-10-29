import { useInvoiceFnLogic } from "@/hooks/invoicing/useInvoiceFnLogic";
import { formatDateAsDMY } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { Alert } from "../Alert/Alert";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";
import { NothingHere } from "../NothingHere";

export interface RemissionNoteModalI {
  onClose: () => void;
  isShow: boolean;
  document: any;
  onElectronic?: boolean;
}

const InfoCard = ({ title, value }: { title: string; value: string | undefined }) => (
  <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-3 flex flex-col items-center justify-center text-center">
    <span className="text-sm text-text-muted font-semibold uppercase tracking-wider">{title}</span>
    <span className="text-lg font-bold text-text-base mt-1">{value || '--'}</span>
  </div>
);

export function RemissionNoteModal(props: RemissionNoteModalI) {
    const { onClose, isShow, document, onElectronic = false } = props;
    const { system, activeConfig } = useConfigStore();
    const { sendRemissions, resendRemission, sending } = useInvoiceFnLogic();
    const isSending = (sending.sendRemissions || sending.resendRemission) ?? false;
    const order = document;
    const showCodeStatus = activeConfig && activeConfig.includes("sales-show-code");
    // igual que RemissionNote::canCharge(): sin facturar, o facturada con su orden eliminada o anulada
    const canCharge = [1, 2].includes(order?.status) || (order?.status === 5 && (!order?.order || [4, 6].includes(order.order.status)));
    const isElectronic = order?.invoice_assigned?.is_electronic === 1 && order?.status !== 4;

    
  if (!isShow || !document || !order) return null;

  const listProducts = order.products && order?.products.map((record: any) => (
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
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle={`Detalles del Documento: #${order?.invoice || ''}`}>
      <Modal.Body>
        <div className="p-4 bg-bg-base text-text-base space-y-6">
          { order ?  <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard title="Cajero" value={order?.employee?.name} />
            <InfoCard title="Fecha" value={formatDateAsDMY(order?.created_at)} />
            <InfoCard title="Tipo Doc." value={order?.invoice_assigned?.name} />
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
              {order?.invoice_assigned?.is_electronic === 1 && <Alert text="Este Documento se envió electrónicamente." />}
              {order?.status === 4 && <Alert text="Este Documento ha sido anulado." type="danger" />}
              {order?.status === 5 && !canCharge && <Alert text="Esta nota de remisión ya fue facturada." type="info" />}
            </div>
          </div>
          {order?.invoice_assigned?.is_electronic === 1 && onElectronic && (
            <div className="text-sm text-text-muted p-3 bg-bg-content rounded-lg border border-bg-subtle">
              Si este documento no se envió electrónicamente, puede reintentarlo <button className="text-primary hover:underline font-semibold" onClick={()=> resendRemission(order?.id)} disabled={isSending}>aquí</button>.
            </div>
          )}
          </> : <NothingHere text="No se encontraron datos del documento" /> }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full gap-4">
          {isElectronic && <Button onClick={()=> resendRemission(order?.id)} disabled={isSending} preset={sending.resendRemission ? Preset.loading : Preset.send} text="Reenviar DTE" />}
          {canCharge && <Button onClick={()=> sendRemissions(order?.id)} disabled={isSending} preset={sending.sendRemissions ? Preset.loading : Preset.save} text="Facturar" />}
          <Button onClick={onClose} disabled={isSending} preset={Preset.close} text="Cerrar" />
        </div>
      </Modal.Footer>
    </Modal>
  );
}