"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";

export interface SpecialSaleProductsModalI {
  onClose: () => void;
  isShow: boolean;
}

export function SpecialSaleProductsModal(props: SpecialSaleProductsModalI) {
  const { onClose, isShow } = props;
  const { order } = ordersStore();
  const { system } = useConfigStore();
  const { getElement } = useTempStorage();
  const specialSaleSelected = getElement('specialSaleSelected');

  if (!isShow) return null;

  const groupedProducts = order?.invoiceproducts?.filter(
    (product: any) => product.group_by === specialSaleSelected?.id
  ) ?? [];

  const listItems = groupedProducts.map((record: any) => (
    <tr key={record.id} className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base">
      <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
        { record.quantity }
      </td>
      <td className="px-3 py-2 whitespace-nowrap font-semibold">
        { record.product }
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
        { numberToMoney(record.unit_price, system) }
      </td>
      <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
        { numberToMoney(record.total, system) }
      </td>
    </tr>
  ));

  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle={`Productos de ${specialSaleSelected?.product ?? 'Venta Especial'}`}>
      <Modal.Body>
        { groupedProducts.length === 0 ? (
          <NothingHere width="150" height="150" text="No hay productos agrupados"/>
        ) : (
          <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                <tr>
                  <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cant</th>
                  <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                  <th scope="col" className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio</th>
                  <th scope="col" className="px-3 py-2 font-bold tracking-wider whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle/50">
                {listItems}
              </tbody>
            </table>
          </div>
        )}
        <div className="w-full flex justify-center gap-4 p-4 mt-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle text-center">
          <span className="font-bold text-text-base uppercase">Total { specialSaleSelected?.product ?? 'Venta Especial' }</span>
          <span className="font-bold text-primary tabular-nums">{ numberToMoney(specialSaleSelected?.total, system) }</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}
