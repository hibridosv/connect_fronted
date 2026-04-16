import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { useQuoteCheckLogic } from "@/hooks/tools/useQuoteCheckLogic";
import { useQuotesLogic } from "@/hooks/tools/useQuotesLogic";
import { formatDate } from "@/lib/date-formats";
import { getTotalOfItem, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useTempStorage from "@/stores/useTempStorage";
import { FaDownload } from "react-icons/fa";
import { Alert } from "../Alert/Alert";
import { ButtonDownloadGet } from "../button/button-download-get";
import { Loader } from "../Loader";

export interface QuotesDetailsModalI {
  onClose: () => void;
  isShow: boolean;
}

export function QuotesDetailsModal({ onClose, isShow }: QuotesDetailsModalI) {
        const { getElement } = useTempStorage();
        const { cashdrawer, system, activeConfig } = useConfigStore();
        const quote = getElement('quoteDetail') || {};
        const { chargeRegisters, sending } = useQuotesLogic();
        const isSending = sending["sendQuote"] || false;
        const { checks, loading } = useQuoteCheckLogic(`tools/quotes/${quote?.id}/check`, isShow);
        


          const listItems = quote?.products?.map((record: any, key: any) => (
            <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
              <td className="px-3 py-2 whitespace-nowrap text-primary text-center">
               { record?.cod }
              </td>
              <td className="px-3 py-2 text-left whitespace-nowrap font-medium " >
               { record?.product }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap`}>
                { record?.quantity }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap`}>
                { numberToMoney(record?.unit_price ? record?.unit_price : 0, system) }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap`}>
                { numberToMoney(record?.discount ? record?.discount : 0, system) }
              </td>
              <td className={`px-3 py-2 text-center whitespace-nowrap`}>
                { numberToMoney(record?.total ? record?.total : 0, system) }
              </td>
            </tr>
          ));
        


  return (
    <Modal show={isShow} onClose={onClose} size="xl5" headerTitle="Detalles de la cotización" removeTitle={true}>
      <Modal.Body>
        <div className="mx-1">
            <div className="w-full grid grid-cols-10 mb-4 text-lg">
                <div className="col-span-7 mx-2">
                    <div><span className="font-bold uppercase">Cliente:</span> { quote?.client?.name }</div>
                    <div><span className="font-bold uppercase">Dirección:</span> { quote?.client?.address }</div>
                </div>
                <div className="col-span-3 mx-2">
                    <div><span className="font-bold uppercase">Creada:</span> { formatDate(quote?.created_at) }</div>
                    <div><span className="font-bold uppercase">Cotización:</span> { quote?.quote_number }</div>
                </div>
            </div>


            <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo </th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Cant</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Precio</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Descuento</th>
                    <th scope="col" className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {listItems}
                </tbody>
                    <tfoot>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col" className="py-3 px-4 border">Total: </th>
                            <th scope="col" className="py-3 px-4 border">{ numberToMoney(getTotalOfItem(quote?.products), system) }</th>
                        </tr>
                    </tfoot>
              </table>
            </div>

                <div className="w-full font-bold text-lg uppercase mt-10">
                Cotización válida hasta el: { formatDate(quote?.expiration)}
                </div>

            <div>
              {
                loading["checkAvailables"] ? (
                  <div className="mt-4 text-center text-text-base">
                    <Loader size="35" />
                  </div>
                ) : (
                <div className="mt-4 text-center text-text-base">
                  <Alert type={checks?.data?.length == 0 ?  "success" : "danger" } className="mt-4" text={checks?.data?.length == 0 ? "Todos los productos tienen existencias disponibles." : "Algunos productos no están disponibles."} />

                  { checks?.data?.length > 0 && (
                    <table className="w-full text-sm text-left mt-2">
                      <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                        <tr>
                          <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Codigo </th>
                          <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Producto</th>
                          <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Solicitados</th>
                          <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Disponibles</th>
                          <th scope="col" className="px-2 py-1 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Faltantes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bg-subtle/50">
                        {
                          checks?.data?.map((record: any) => (
                            <tr key={record.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base`}>
                              <td className="px-1 py-1 whitespace-nowrap text-primary text-center">
                              { record?.product_code }
                              </td>
                              <td className="px-1 py-1 text-left whitespace-nowrap font-medium " >
                              { record?.product_name }
                              </td>
                              <td className={`px-1 py-1 text-center whitespace-nowrap`}>
                                { record?.requested_quantity }
                              </td>
                              <td className={`px-1 py-1 text-center whitespace-nowrap`}>
                                { record?.available_quantity }
                              </td>
                              <td className={`px-1 py-1 text-center whitespace-nowrap font-semibold`}>
                                { record?.requested_quantity  - record?.available_quantity  }
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
          {
           quote && !isSending && 
           <ButtonDownloadGet href={`id=${quote.id}&route=download.pdf.quote`}><FaDownload  size={24}/></ButtonDownloadGet>
          }
          <Button onClick={()=>chargeRegisters(quote.id)} preset={isSending ? Preset.saving : Preset.save} text="Facturar" disabled={isSending} />
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
        </div>
      </Modal.Footer>
    </Modal>
  );
}