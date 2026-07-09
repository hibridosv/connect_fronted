import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { requiredFieldsCCF, validateInvoiceFields } from "@/lib/validator-functions";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { sumarTotales } from "../../utils";


export function PayButton({ isSplit = false }: any) {
  const { order, sending, collecting } = ordersStore();
  const { pay, paySplit } = useOrderRestaurantFnLogic();
  const { system, cashdrawer, tenant } =useConfigStore();
  const { getElement} = useTempStorage();
  const payMethod = getElement('payMethod') ?? 1;

    const invoice = order;
    const validateFields = ()=>{
      if (invoice?.client_id && invoice?.invoice_assigned?.type == 3) {
        return validateInvoiceFields(invoice?.client, requiredFieldsCCF)
      }
    }
  
    let fieldsRequired = validateFields();
    
  let isSuspended = tenant?.status == 2 ? true : false;
  const total = sumarTotales(order?.invoiceproducts);
  const blockMaxQuantityWithOutNit = system?.country == 3 && total >= 2500 && !order?.client_id;
  const disabledButonPay = collecting || sending || !cashdrawer || blockMaxQuantityWithOutNit || (!order?.client_id && (order?.invoice_assigned?.type == 3 || order?.invoice_assigned?.type == 4)) || isSuspended || (fieldsRequired && fieldsRequired.length > 0);
  
  if (!order) return <></>

    return (
        <div className="w-full">
          { payMethod == 1 ?
            <button
              disabled={disabledButonPay}
              type="submit"
              className={`button-cyan w-full transition-opacity duration-200 ${disabledButonPay ? 'opacity-50 cursor-not-allowed' : 'clickeable'}`}
            >
              <FaRegMoneyBillAlt className="mr-1.5" size={20} /> Cobrar
            </button>
            :
            <div
              className={`button-cyan w-full transition-opacity duration-200 ${disabledButonPay ? 'opacity-50 cursor-not-allowed' : 'clickeable'}`}
              title="Cobrar"
              onClick={(disabledButonPay) ? ()=>{} : isSplit ? ()=>paySplit({ cash: 0 }) : ()=>pay({ cash: 0 })}
            >
              <FaRegMoneyBillAlt className="mr-1.5" size={20} /> Cobrar
            </div>
          }
        </div>
    );

}
