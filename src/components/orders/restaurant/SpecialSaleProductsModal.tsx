"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";

export interface SpecialSaleProductsModalI {
  onClose: () => void;
  isShow: boolean;
}

export function SpecialSaleProductsModal(props: SpecialSaleProductsModalI) {
  const { onClose, isShow } = props;
  const { order } = ordersStore();
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
    </tr>
  ));

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle={`Productos de ${specialSaleSelected?.product ?? 'Venta Especial'}`}>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle/50">
                {listItems}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}
