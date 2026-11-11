import { Spinner } from "@/components/Spinner";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import ordersStore from "@/stores/orders/ordersStore";
import { BsPrinterFill } from "react-icons/bs";


export function PrintOrderButton() {
  const { order, saving, collecting} = ordersStore();
  const { save } = useOrderRestaurantFnLogic();
  const isBlock = collecting || saving;
  
  if (!order) return <></>

    return (
        <div className={`button-lime relative ${isBlock ? 'opacity-50 cursor-not-allowed' : 'clickeable'}`} title="Imprimir Precuenta" 
        onClick={ isBlock ? ()=>{} : () => save(order.id, true)} >
          { saving ? <Spinner size={22} color="current" /> : <BsPrinterFill size={22} /> }
        </div>
    );

}
