"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { formatDateAsDMY, formatHourAsHM } from "@/lib/date-formats";
import { calculateOrderTotal, numberToMoney } from "@/lib/utils";
import { getServices } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdLock, MdLockOpen } from "react-icons/md";
import { groupInvoiceProductsByCodAll, sumarOptionsTotal } from "../utils";

export interface OrderDetailsModalI {
  onClose: () => void;
  isShow: boolean;
}

/**
 * Detalles de la orden de una mesa sin abrirla: productos, total y si otro usuario la tiene aperturada.
 * Usa el elemento temporal 'orderDetails': { orderId }.
 */
export function OrderDetailsModal(props: OrderDetailsModalI) {
  const { onClose, isShow } = props;
  const { system, user } = useConfigStore();
  const { select } = useOrderRestaurantFnLogic();
  const { getElement, setElement } = useTempStorage();
  const orderId = getElement('orderDetails')?.orderId;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isShow || !orderId) return;
    const loadOrder = async () => {
      setLoading(true);
      try {
        const response = await getServices(`orders/find?filterWhere[id]==${orderId}&included=invoiceproducts,invoiceproducts.options.option,employee,openedBy,client,attributes,table,joinedTables`);
        setOrder(response.data.data ? groupInvoiceProductsByCodAll(response.data.data) : null);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    loadOrder(); // datos frescos al abrir, otro usuario pudo abrirla o cerrarla
  }, [isShow, orderId]);

  if (!isShow) return null;

  const handleClose = () => {
    setOrder(null);
    onClose();
  };

  const handleOpen = () => {
    setElement('selectedTable', order.table?.id); // igual que al tocar la mesa
    select(order.id);
    handleClose();
  };

  // status 1: la tiene abierta opened_by, status 2: guardada y libre para abrir
  const isOpened = order?.status == 1;
  const isMine = isOpened && order?.opened_by_id === user?.id;
  const tables = [order?.table, ...(order?.joinedTables ?? [])].filter(Boolean).map((table: any) => table.name).join(', ');
  const extras = order ? sumarOptionsTotal(order.invoiceproducts) : 0;
  const total = order ? calculateOrderTotal(order) + extras : 0;
  const tipsPercentage = order?.attributes?.tips_percentage ?? 0;

  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle={`Detalles de la orden${tables ? ` - ${tables}` : ''}`}>
      <Modal.Body>
        { loading ?
          <div className="flex justify-center py-10"><CgSpinner className="animate-spin text-primary" size={32} /></div> :
          !order ?
          <NothingHere width="150" height="150" text="No se encontró la orden" /> :
          <div className="flex flex-col gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${isOpened ? 'bg-danger/5 border-danger/20' : 'bg-success/5 border-success/20'}`}>
              { isOpened ? <MdLock className="w-7 h-7 shrink-0 text-danger" /> : <MdLockOpen className="w-7 h-7 shrink-0 text-success" /> }
              <div>
                <p className={`text-sm font-bold uppercase ${isOpened ? 'text-danger' : 'text-success'}`}>
                  { isOpened ? 'Orden aperturada' : 'Orden guardada' }
                </p>
                <p className="text-sm text-text-base">
                  { isOpened ? <>La tiene abierta <span className="font-semibold">{order.opened_by?.name ?? 'otro usuario'}</span>{ isMine && ' (usted)' }</> : 'Nadie la tiene abierta, puede abrirla' }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-text-muted">Mesero: </span><span className="font-semibold">{order.employee?.name ?? '-'}</span></div>
              <div><span className="text-text-muted">Clientes: </span><span className="font-semibold">{order.attributes?.clients_quantity ?? '-'}</span></div>
              <div><span className="text-text-muted">Creada: </span><span className="font-semibold">{formatDateAsDMY(order.created_at)} {formatHourAsHM(order.created_at)}</span></div>
              <div><span className="text-text-muted">Cliente: </span><span className="font-semibold">{order.client?.name ?? '-'}</span></div>
            </div>

            { order.invoiceproductsGroup?.length > 0 ?
              <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden divide-y divide-bg-subtle max-h-72 overflow-y-auto custom-scrollbar">
                { order.invoiceproductsGroup.map((record: any) => (
                  <div key={record.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <span className="w-8 text-center font-semibold">{record.quantity}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate uppercase">{record.product}</p>
                      { record.options?.length > 0 &&
                        <p className="text-xs text-text-muted truncate">{record.options.map((option: any) => option.option?.name).filter(Boolean).join(', ')}</p> }
                    </div>
                    <span className="font-semibold tabular-nums">{numberToMoney(record.total, system)}</span>
                  </div>
                ))}
              </div> :
              <NothingHere width="120" height="120" text="La orden no tiene productos" />
            }

            <div className="flex flex-col gap-1 text-sm uppercase">
              { tipsPercentage > 0 &&
                <div className="flex justify-between"><span className="text-text-muted">Propina ({tipsPercentage}%)</span><span>{numberToMoney(tipsPercentage / 100 * total, system)}</span></div> }
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{numberToMoney(total + (tipsPercentage / 100 * total), system)}</span></div>
            </div>
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        { order && !isOpened && <Button onClick={handleOpen} preset={Preset.primary} text="Abrir orden" /> }
        <Button onClick={handleClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
