
import { Button, Preset } from "@/components/button/button";
import { ButtonDownloadGet } from "@/components/button/button-download-get";
import Modal from "@/components/modal/Modal";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import { FaDownload } from "react-icons/fa";
import { typeFailure } from "../utils";



export interface LotDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  product: any;
}

export function LotDetailsModal(props: LotDetailsModalProps) {
    const { onClose, isShow, product } = props;


  const listItems = product?.failures && product?.failures.map((record: any) => (
        <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle ${record.status === 0 ? 'bg-danger/10 text-danger' : 'text-text-base'}`}>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record?.product?.cod }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record?.product?.description }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record.quantity }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
             { record.reason }
        </td>
        <td className="px-3 py-2 whitespace-nowrap font-medium text-primary text-center">
            { record?.employee?.name }
        </td>
        </tr>
    ));


  return (
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle="Detalles de la salida de productos" closeOnOverlayClick={false} hideCloseButton={true}>
      <Modal.Body>

        <div className="p-4 bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <div className="flex justify-between items-center p-4 border-b border-bg-subtle mb-4">
                <div><span className="font-medium text-text-base">Tipo de Salida:</span> <span className="text-text-muted">{ typeFailure(product?.type)}</span></div>
                <div><span className="font-medium text-text-base">Fecha de Salida:</span> <span className="text-text-muted">{ formatDate(product?.created_at)} { formatHourAsHM(product?.created_at)}</span></div>
            </div>
            {product && product?.failures ? (
                <div className="relative overflow-x-auto border border-bg-subtle rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Cod</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Producto</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Cant</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Razón</th>
                                <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle last:border-r-0 text-center">Usuario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bg-subtle/50">
                            {listItems}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-3 text-center bg-info/10 text-info rounded-lg">
                    <p>No hay registros para este item.</p>
                </div>
            )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ButtonDownloadGet href={`id=${product?.id}&route=download.pdf.failure`}><FaDownload size={24} /></ButtonDownloadGet>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}