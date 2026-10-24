"use client";
import { Button, Preset } from "@/components/button/button";
import { Loader } from "@/components/Loader";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import { URL } from "@/constants";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { TbPointFilled } from "react-icons/tb";

const SHIPPING_COD = 9999999998; // envio de delivery
const EXTRAS_COD = 9999999999; // venta especial / extras

export interface ProductOptionsEditModalI {
  onClose: () => void;
  isShow: boolean;
}

/** Agrega o quita opciones del catalogo a un producto que ya esta en la orden */
export function ProductOptionsEditModal(props: ProductOptionsEditModalI) {
  const { onClose, isShow } = props;
  const { order, sending } = ordersStore();
  const { system } = useConfigStore();
  const { options, loadingOptions, loadOptions } = manageRestaurantStore();
  const { addProductOption, removeProductOption } = useOrderRestaurantFnLogic();
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    if (isShow) loadOptions("restaurant/options?included=variants");
  }, [isShow, loadOptions]);

  if (!isShow) return null;

  const handleClose = () => {
    setProductId(null);
    onClose();
  }

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

  const products = order?.invoiceproducts?.filter((product: any) =>
    product.product_id && product.special == 0 && ![SHIPPING_COD, EXTRAS_COD].includes(Number(product.cod))
  ) ?? [];
  const product = products.find((record: any) => record.id === productId);
  const activeOptions = (record: any) => record?.options?.filter((option: any) => option.status == 1) ?? [];
  const hasPendingOptions = product?.options?.some((option: any) => option.status == 0);

  const handleAdd = async (variantId: string) => {
    if (!product || sending) return;
    const previousIds = order.invoiceproducts.map((record: any) => record.id);
    const added = await addProductOption(order.id, product.id, variantId);
    // si el producto estaba agrupado el backend separa una unidad: se sigue con la linea nueva
    if (added && product.quantity > 1) {
      const newLine = ordersStore.getState().order?.invoiceproducts?.find((record: any) => !previousIds.includes(record.id));
      if (newLine) setProductId(newLine.id);
    }
  }

  const handleRemove = (optionId: string) => {
    if (sending) return;
    removeProductOption(order.id, optionId);
  }

  const productList = (
    products.length === 0 ? <NothingHere width="150" height="150" text="No hay productos en la orden" /> :
    <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden divide-y divide-bg-subtle">
      { products.map((record: any) => (
        <div key={record.id} className="p-3 clickeable hover:bg-bg-subtle" onClick={() => setProductId(record.id)}>
          <div className="flex items-center text-base font-medium text-text-base">
            <span className="font-bold text-lg mr-3">{record.quantity}x</span>
            <span className="uppercase flex-grow">{record.product}</span>
          </div>
          { activeOptions(record).length > 0 && (
            <ul className="list-none pl-8">
              { activeOptions(record).map((option: any) => (
                <li key={option.id} className="flex items-center text-sm text-text-muted">
                  <TbPointFilled className="text-accent mr-2 flex-shrink-0" size={14} />
                  <span>{option?.option?.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const productDetail = product && (
    <div className={`${sending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center text-base font-medium text-text-base mb-2">
        <span className="font-bold text-lg mr-3">{product.quantity}x</span>
        <span className="uppercase flex-grow">{product.product}</span>
      </div>
      { product.quantity > 1 && (
        <p className="text-xs text-amber-600 mb-2">Al agregar una opción se separará una unidad de este producto.</p>
      )}
      <div className="mb-4">
        { activeOptions(product).length === 0 ?
          <p className="text-sm text-text-muted">Sin opciones</p> :
          <ul className="list-none">
            { activeOptions(product).map((option: any) => (
              <li key={option.id} className="flex items-center justify-between text-sm text-text-base py-1 border-b border-bg-subtle">
                <span>
                  {option?.option?.name}
                  {option?.option?.price > 0 && (
                    <span className="ml-1.5 text-xs text-text-muted">(+{numberToMoney(option.option.price, system)})</span>
                  )}
                </span>
                <AiFillCloseCircle className="text-red-500 clickeable" size={20} title="Quitar opción" onClick={() => handleRemove(option.id)} />
              </li>
            ))}
          </ul>
        }
      </div>
      { hasPendingOptions ?
        <p className="text-sm text-red-500">Primero seleccione las opciones pendientes del producto.</p> :
        loadingOptions ? <Loader size="60" /> :
        !options || options.length === 0 ? <NothingHere width="150" height="150" text="No hay opciones registradas" /> :
        options.map((group: any) => group.variants?.length > 0 && (
          <div key={group.id} className="mb-3">
            <p className="font-semibold uppercase text-sm text-text-base border-b border-bg-subtle mb-1">{group.name}</p>
            <div className="flex flex-wrap justify-center">
              { group.variants.map((variant: any) => (
                <div key={variant.id} className="m-2 clickeable" onClick={() => handleAdd(variant.id)}>
                  <div className="rounded-md drop-shadow-lg">
                    <div className="relative">
                      <Image loader={imageLoader} src={variant.image} alt="Icono" width={96} height={96} className="rounded-t-md" />
                      {variant.price > 0 && (
                        <span className="absolute top-1 right-1 bg-black/50 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                          +{numberToMoney(variant.price, system)}
                        </span>
                      )}
                    </div>
                    <p className="w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 h-9 bg-slate-300"
                      style={{ maxWidth: '96px', wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                      {variant.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );

  return (
    <Modal show={isShow} onClose={handleClose} size="md" headerTitle={product ? "Opciones del producto" : "Seleccione el producto"}>
      <Modal.Body>
        { product ? productDetail : productList }
      </Modal.Body>
      <Modal.Footer>
        { product && <Button onClick={() => setProductId(null)} preset={Preset.back} text="Productos" /> }
        <Button onClick={handleClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
