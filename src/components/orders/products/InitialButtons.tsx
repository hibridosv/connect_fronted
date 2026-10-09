
import CodeRequestGuard from "@/components/modal/CodeRequestGuard";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from '@/stores/useTempStorage';
import { MdMoney, MdOutlinePointOfSale } from "react-icons/md";



export function InitialButtons() {
  const { order } = ordersStore();
  const { activeConfig } = useConfigStore();
  const { openModal} = useModalStore();
  const { getElement } = useTempStorage();
  const serviceType: number = getElement('serviceType');
  const clientOrder = getElement('clientOrder');


  const isOtherSales = activeConfig && activeConfig.includes("sales-other-sales");
  const isSpecial = activeConfig && activeConfig.includes("sales-special");

  if (order || (serviceType == 3 && !clientOrder)) return null;

  return (
    <div className="flex justify-center space-x-4 mt-4">
              { isOtherSales && 
              <CodeRequestGuard permission="code-request-others-sales" onAuthorized={()=> openModal('otherSales')} > 
                <MdOutlinePointOfSale className="clickeable text-lime-500 shadow-md" size={24} title="Otras Ventas" /> 
              </CodeRequestGuard>
              }
              { isSpecial && 
              <MdMoney className="clickeable text-teal-500 shadow-md" size={24} title="Ventas Especiales" onClick={()=> openModal('specialSales')} />
              }
    </div>
    );
}
