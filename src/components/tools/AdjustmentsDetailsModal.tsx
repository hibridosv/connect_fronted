import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useAjustmentModalLogic } from "@/hooks/tools/useAjustmentModalLogic";
import { usePagination } from "@/hooks/usePagination";
import { formatDate, formatHourAsHM } from "@/lib/date-formats";
import adjustStore from "@/stores/tools/adjustStore";
import useTempStorage from "@/stores/useTempStorage";
import { FaDownload } from "react-icons/fa";
import { ButtonDownloadGet } from "../button/button-download-get";
import { NothingHere } from "../NothingHere";
import { Pagination } from "../Pagination";
import SkeletonTable from "../skeleton/skeleton-table";

export interface AdjustmentsDetailsModalI {
  onClose: () => void;
  isShow: boolean;
}

export function AdjustmentsDetailsModal(props: AdjustmentsDetailsModalI) {
        const { onClose, isShow } = props;
        const { getElement } = useTempStorage();
        const record = getElement('adjustmentDetails') || null;
        const {currentPage, handlePageNumber} = usePagination("&page=1");
        useAjustmentModalLogic(currentPage, isShow);
        const { adjustment, loadingAdjustment } = adjustStore();
        const records = adjustment?.data || [];

        
          const listItems = records?.map((record: any) => (
            <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
              <td className="px-3 py-2 whitespace-nowrap text-primary text-center">
               { formatDate(record?.updated_at) } { formatHourAsHM(record?.updated_at) }
              </td>
              <td className="px-3 py-2 text-left whitespace-nowrap font-medium " >
               { record?.cod }
              </td>
              <td className={`px-3 py-2 text-left whitespace-nowrap`}>
                { record?.name }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap`}>
                { record?.quantity }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap`}>
                { record?.stablished }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap font-bold ${record?.difference == 0 ? "text-black" : record?.difference > 0 ? "text-lime-600" : "text-red-600" }`}>
                { record?.difference }
              </td>
            </tr>
          ));
        


  return (
    <Modal show={isShow} onClose={onClose} size="xl5" headerTitle="Productos cambiados">
      <Modal.Body>
        <div className="mx-1">
            { loadingAdjustment ? <SkeletonTable rows={5} columns={6} /> : (!records || records.length === 0) ? null :
            <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle mb-4">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Fecha</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo </th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cantidad</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Establecido</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Diferencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {listItems}
                </tbody>
              </table>
            </div>
            }
            { !loadingAdjustment && (!records || records.length === 0) && (<NothingHere text="No existen registros de cambios" />)}
            <Pagination records={adjustment} handlePageNumber={handlePageNumber } />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
        {
          record &&
          <ButtonDownloadGet href={`id=${record.id}&route=download.pdf.adjustment`}><FaDownload size={24} /></ButtonDownloadGet>
        }
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}