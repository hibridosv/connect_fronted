"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { TbPointFilled } from "react-icons/tb";

export interface GroupedOptionsProductsModalI {
  onClose: () => void;
  isShow: boolean;
}

export function GroupedOptionsProductsModal(props: GroupedOptionsProductsModalI) {
  const { onClose, isShow } = props;
  const { order } = ordersStore();
  const { getElement } = useTempStorage();
  const productSelected = getElement('productOptionsGroupSelected');

  if (!isShow) return null;

  const groupedProducts = order?.invoiceproducts?.filter(
    (product: any) => product.product_id === productSelected?.product_id
  ) ?? [];

  return (
    <Modal show={isShow} onClose={onClose} size="sm" headerTitle={`Opciones de ${productSelected?.product ?? 'Producto'}`}>
      <Modal.Body>
        { groupedProducts.length === 0 ? (
          <NothingHere width="150" height="150" text="No hay productos agrupados" />
        ) : (
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
            <div className="divide-y divide-bg-subtle">
              { groupedProducts.map((record: any) => (
                <div key={record.id}>
                  <div className="p-3">
                    <div className="flex items-center text-base font-medium text-text-base">
                      <span className="font-bold text-lg mr-3">{record.quantity}x</span>
                      <span className="uppercase flex-grow">{record.product}</span>
                    </div>
                  </div>
                  { record.options?.length > 0 && (
                    <div className="bg-bg-subtle/50 px-4 py-2 border-t border-bg-subtle">
                      <ul className="list-none pl-4">
                        { record.options.map((option: any) => (
                          <li key={option.id} className="flex items-center text-sm text-text-muted">
                            <TbPointFilled className="text-accent mr-2 flex-shrink-0" size={14} />
                            <span>{option?.option?.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}
