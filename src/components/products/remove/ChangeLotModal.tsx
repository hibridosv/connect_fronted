
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useLotAssignLogic } from "@/hooks/products/useLotAssignLogic";
import { Product } from "@/interfaces/products";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import useStateStore from "@/stores/stateStorage";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { FaRegSave } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";


export interface ChangeLotModalProps {
  onClose: () => void;
  isShow: boolean;
  product: Product;
}

export function ChangeLotModal(props: ChangeLotModalProps) {
    const { onClose, isShow, product } = props;
    const { lots } = useLotAssignLogic(product, isShow);
    const { getElement, setElement, clearElement } = useTempStorage();
    const { loading } = useStateStore();
    const lotSelected = getElement("lotSelected");
    const isSending = loading["lotAssign"] ? true : false;

    if (!isShow || !product) return null;

  const listItems = lots && lots.map((record: any) => (
        <tr key={product.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${product.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record.actual_stock }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { formatDate(record.created_at) } { formatHourAsHM(record.created_at) }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record.expiration ? formatDate(record.expiration) : "--"}
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record.lot ?? "--" }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            <span className="flex justify-between">
                {
                lotSelected?.id === record.id ? 
                    <RiCloseCircleFill size={20} className="text-red-600 clickeable" 
                        onClick={()=> clearElement("lotSelected") } /> :
                record.actual_stock < lotSelected?.quantity ? 
                    <FaRegSave size={20} className="text-gray-700 clickeable" 
                        onClick={()=> useToastMessageStore.getState().setError({ message : "No existen cantidades suficientes en este lote"})} /> : 
                    <FaRegSave size={20} className="text-lime-700 clickeable" 
                        onClick={()=> setElement("lotSelected", record)} />
                }
            </span>
        </td>
        </tr>
    ));


  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle="Asignar Lote" closeOnOverlayClick={false} hideCloseButton={true}>
      <Modal.Body>

        <div className="p-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            {lots && lots.length > 0 ? (
                <div className="relative overflow-x-auto border border-bg-subtle rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Cant</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Fecha</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Vence</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Lote</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bg-subtle/50">
                            {listItems}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-3 text-center bg-blue-500/10 text-blue-500 rounded-lg">
                    <p>No hay registros para este item.</p>
                </div>
            )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}