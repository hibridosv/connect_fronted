
import { useCutLogic } from "@/hooks/cuts/useCutLogic";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";
import { SkeletonCashDrawerDetails } from "../skeleton/SkeletonCashDrawerDetails";

export interface CashdrawerDetailsProps {
  onClose: () => void;
  isShow: boolean;
}

export function CashdrawerDetails(props: CashdrawerDetailsProps) {
    const { onClose, isShow } = props;
    const { system } = useConfigStore();
    const { cut, loading } = useCutLogic(`cuts/last?included=employee,cashdrawer`, isShow);

  if (!isShow) return null

  return (
    <Modal show={isShow} onClose={onClose} size="xl" headerTitle="Detalles del corte" closeOnOverlayClick={false} hideCloseButton={true}>
      <Modal.Body>
        { loading && <SkeletonCashDrawerDetails /> }
        { !loading && <>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6"> {/* Added gap and mb */}
          {/* Card 1: Efectivo Apertura */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center"> {/* Professional styling */}
            <div className="text-gray-600 text-sm mb-1">Efectivo Apertura</div>
            <div className="font-bold text-3xl text-gray-900">
              { numberToMoney(cut?.inicial_cash ? cut?.inicial_cash : 0, system) }
            </div>
          </div>
          {/* Card 2: Efectivo Cierre */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center"> {/* Professional styling */}
            <div className="text-gray-600 text-sm mb-1">Efectivo Cierre</div>
            <div className="font-bold text-3xl text-gray-900">
              { numberToMoney(cut?.final_cash ? cut?.final_cash : 0, system) }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-9 gap-4 mb-6"> {/* Added gap and mb */}
          {/* Card 3: Salidas */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center"> {/* Professional styling */}
            <div className="text-gray-600 text-sm mb-1">Salidas</div>
            <div className="font-bold text-3xl text-red-600"> {/* Emphasize negative */}
              { numberToMoney(cut?.cash_expenses ? cut?.cash_expenses : 0, system) }
            </div>
          </div>
          {/* Card 4: Entradas */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center"> {/* Professional styling */}
            <div className="text-gray-600 text-sm mb-1">Entradas</div>
            <div className="font-bold text-3xl text-green-600"> {/* Emphasize positive */}
              { numberToMoney(cut?.cash_incomes ? cut?.cash_incomes : 0, system) }
            </div>
          </div>
          {/* Card 5: Diferencia */}
          <div className="col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center"> {/* Professional styling */}
            <div className="text-gray-600 text-sm mb-1">Diferencia</div>
            <div className={`font-bold text-3xl ${cut && cut.cash_diference < 0 ? 'text-red-600' : 'text-blue-600'}`}> {/* Conditional color */}
              { numberToMoney(cut?.cash_diference ? cut?.cash_diference : 0, system) }
            </div>
          </div>
        </div>
        </> }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}



