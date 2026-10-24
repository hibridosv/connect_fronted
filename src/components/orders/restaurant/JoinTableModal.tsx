"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import ordersRestaurantsStore from "@/stores/orders/ordersRestaurantsStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect, useState } from "react";
import { MdTableRestaurant } from "react-icons/md";

export interface JoinTableModalI {
  onClose: () => void;
  isShow: boolean;
}

/**
 * Une mesas a una orden (varias mesas, una sola orden).
 * Usa el elemento temporal 'joinTable':
 * - { orderId, tableId }: une mesas libres a la orden de la mesa principal tableId.
 * - { freeTableId }: elige la mesa ocupada a la que se une la mesa libre.
 */
export function JoinTableModal(props: JoinTableModalI) {
  const { onClose, isShow } = props;
  const { tables, sending } = ordersStore();
  const { loadTables } = ordersRestaurantsStore();
  const { joinTable, unjoinTable } = useOrderRestaurantFnLogic();
  const { getElement } = useTempStorage();
  const joinData = getElement('joinTable');
  const [zoneId, setZoneId] = useState<string | null>(null);

  useEffect(() => {
    if (isShow) loadTables(`tables?included=tables`, false); // datos frescos al abrir
  }, [isShow, loadTables]);

  const allTables: any[] = Array.isArray(tables) ? tables.flatMap((location: any) => location.tables ?? []) : [];
  const baseTable = allTables.find((table: any) => table.id === (joinData?.tableId ?? joinData?.freeTableId));

  // empieza por la zona de la mesa principal (o de la mesa libre)
  useEffect(() => {
    if (isShow && !zoneId && baseTable) setZoneId(baseTable.restaurant_table_location_id);
  }, [isShow, zoneId, baseTable]);

  if (!isShow || !joinData) return null;

  const handleClose = () => {
    setZoneId(null);
    onClose();
  }

  const isChooseOrder = !!joinData.freeTableId;
  const zone = Array.isArray(tables) ? tables.find((location: any) => location.id === zoneId) ?? tables[0] : null;
  const joinedTables = allTables.filter((table: any) => table.combining_by && table.combining_by === joinData.tableId);
  const zoneTables = (zone?.tables ?? []).filter((table: any) => isChooseOrder
    ? table.status == 1 && table.ticket_order_id && !table.combining_by // mesas principales ocupadas
    : table.status == 0 && !table.ticket_order_id // mesas libres
  );

  const handleSelect = async (table: any) => {
    if (sending) return;
    if (isChooseOrder) {
      const success = await joinTable(table.ticket_order_id, joinData.freeTableId);
      if (success) handleClose();
    } else {
      joinTable(joinData.orderId, table.id);
    }
  }

  const handleUnjoin = (table: any) => {
    if (sending) return;
    unjoinTable(joinData.orderId, table.id);
  }

  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle={isChooseOrder ? `Unir ${baseTable?.name ?? 'mesa'} a una mesa ocupada` : `Unir mesas a ${baseTable?.name ?? 'la mesa'}`}>
      <Modal.Body>
        <div className={`flex flex-col gap-4 ${sending ? 'opacity-50 pointer-events-none' : ''}`}>
          { !isChooseOrder && joinedTables.length > 0 && (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden divide-y divide-bg-subtle">
              { joinedTables.map((table: any) => (
                <div key={table.id} className="flex items-center justify-between p-2">
                  <span className="text-sm font-semibold uppercase text-text-base">{table.name}</span>
                  <Button onClick={() => handleUnjoin(table)} preset={Preset.cancel} text="Separar" disabled={sending} />
                </div>
              ))}
            </div>
          )}

          { Array.isArray(tables) && tables.length > 1 && (
            <div className="flex gap-1 bg-bg-subtle/50 p-1 rounded-lg">
              { tables.map((record: any) => {
                const isActive = record.id == zone?.id;
                return (
                  <button key={record.id}
                    className={` flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-100
                      ${isActive ? 'bg-primary text-text-inverted shadow-sm' : 'text-text-muted hover:text-text-base hover:bg-bg-content' } `}
                    onClick={() => setZoneId(record.id)} >
                    {record.name}
                  </button>
                );
              })}
            </div>
          )}

          { zoneTables.length === 0 ?
            <NothingHere width="150" height="150" text={isChooseOrder ? "No hay mesas ocupadas en esta zona" : "No hay mesas disponibles en esta zona"} /> :
            <div className="flex flex-wrap justify-center gap-3">
              { zoneTables.map((table: any) => (
                <div key={table.id} className="clickeable w-24 bg-bg-content rounded-xl border border-bg-subtle hover:shadow-md transition-all duration-300" onClick={() => handleSelect(table)}>
                  <div className="flex justify-center pt-2">
                    <MdTableRestaurant className="w-7 h-7 text-secondary" />
                  </div>
                  <p className="text-[11px] font-semibold text-text-base uppercase truncate text-center px-2 py-1.5" title={table.name}>
                    {table.name}
                  </p>
                </div>
              ))}
            </div>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
