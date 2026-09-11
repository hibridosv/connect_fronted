"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { URL } from "@/constants";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { getLastElement, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import Image from "next/image";



export interface ProductOptionsModalI {
  onClose: () => void;
  isShow: boolean;
}

export function ProductOptionsModal(props: ProductOptionsModalI) {
  const {  onClose, isShow } = props;
  const { order } = ordersStore();
  const { option } = useOrderRestaurantFnLogic();
  const { system } = useConfigStore();



const handleUpdate = (data: any) => {
    option(order.id, data);
    onClose();
  }



  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
    }

    const LastProduct = getLastElement(order?.invoiceproducts)
    const lastOption = getLastElement(LastProduct?.options, "status", 0)

    const listItems = LastProduct && LastProduct?.options.map((record: any) => {
        if (record?.iden == lastOption?.iden) {
            return (
                <div key={record?.id} className="m-2 clickeable">
                    <div onClick={() => { handleUpdate({ id: record.id, iden: record.iden}) }}
                    className="rounded-md drop-shadow-lg">
                        <div className="relative">
                            <Image loader={imageLoader} src={record?.option?.image} alt="Icono" width={96} height={96} className="rounded-t-md" />
                            {record?.option?.price > 0 && (
                                <span className="absolute top-1 right-1 bg-black/50 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                                    +{numberToMoney(record.option.price, system)}
                                </span>
                            )}
                        </div>
                        <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 h-9 bg-slate-300`}
                        style={{ maxWidth: '96px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            {record?.option?.name}
                        </p>
                    </div>
                </div>
            )
        }
    });

  return (
        <Modal show={isShow} onClose={onClose} size="xs" headerTitle="Seleccione la Opción" closeOnOverlayClick={false} hideCloseButton={true} >
          <Modal.Body>
                <div className="flex flex-wrap justify-center">
                    {listItems }
                </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>handleUpdate({ iden: lastOption.iden})} preset={Preset.close} text="Saltar Opción" isFull />
          </Modal.Footer>
        </Modal>
  );
}
