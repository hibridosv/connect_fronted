import { formatDuiWithAll, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import { sumarDiscount, sumarSalesTotal, sumarSubtotal, sumarTotalesWithoutDiscount, sumarTotalRetentionRenta } from "../utils";


export function RestaurantShowTotal({ order}: any) {
  const { sending} = ordersStore();
  const { system } =useConfigStore();


  if (!order) return <></>
  const retentionRenta: number = sumarTotalRetentionRenta(order);


//   const total = sumarCantidad(order?.invoiceproducts);
  const subtotal: number = sumarTotalesWithoutDiscount(order?.invoiceproducts);
  const discount: number = sumarDiscount(order?.invoiceproducts);
  const tips_percentage: number = order?.attributes?.tips_percentage ?? 0;


    const isExcludedClient = order?.client?.excluded == 1;
    const retencionRentas = order?.retention_rent ?? 0 ;

  
    const total: number = isExcludedClient
      ? sumarSubtotal(order.invoiceproducts)
      : (retencionRentas > 0
          ? (sumarSalesTotal(order) - retentionRenta)
          : sumarSalesTotal(order));

    return (
        <div className="px-3 pt-2 pb-2 w-full animate-slide-up">
            <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle overflow-hidden uppercase mb-4">

                <div className={`flex justify-between items-center px-4 py-1 transition-colors duration-300
                    ${sending ? 'text-danger animate-pulse' : 'text-text-muted'}`}>
                    <span className="text-sm font-medium">Sub total</span>
                    <span className="text-sm font-semibold tabular-nums">
                        { numberToMoney(subtotal, system)}
                    </span>
                </div>

                <div className={`flex justify-between items-center px-4 py-1 border-t border-bg-subtle/60 transition-colors duration-300
                    ${sending ? 'text-danger animate-pulse' : discount > 0 ? 'text-success' : 'text-text-muted'}`}>
                    <span className="text-sm font-medium">Descuento</span>
                    <span className="text-sm font-semibold tabular-nums">
                        {discount > 0 && '- '}{ numberToMoney(discount, system)}
                    </span>
                </div>

                { tips_percentage > 0 &&
                    <div className={`flex justify-between items-center px-4 py-1 border-t border-bg-subtle/60 transition-colors duration-300
                        ${sending ? 'text-danger animate-pulse' : 'text-text-muted'}`}>
                        <span className="text-sm font-medium">Propina | { tips_percentage }%</span>
                        <span className="text-sm font-semibold tabular-nums">
                            { numberToMoney((tips_percentage / 100 * total), system)}
                        </span>
                    </div>
                }

                <div className={`flex justify-between items-center px-4 py-1 bg-primary/5 border-t-2 border-primary/20 transition-all duration-500
                    ${sending ? 'text-danger animate-pulse' : 'text-text-base'}`}>
                    <span className="text-xl font-bold tracking-wide">Total</span>
                    <span className={`text-xl font-bold tabular-nums transition-transform duration-300
                        ${sending ? 'scale-95' : 'scale-100'}`}>
                        { numberToMoney(total + (tips_percentage / 100 * total), system)}
                    </span>
                </div>
            </div>

            {order?.client?.name && (
            <div className="flex justify-between"> 
                <span className="text-text-muted">Cliente:</span>
                <div className="text-right">
                <span className="font-semibold text-text-base">{order.client.name}</span>
                <span className="block text-xs text-text-muted">{order.client.document ? formatDuiWithAll(order.client.document) : formatDuiWithAll(order.client.id_number)}</span>
                </div>
            </div>
            )}

            {order?.comment && (
                <div className="border-t border-bg-subtle pt-3"> 
                <p className="text-sm">
                    <span className="font-semibold text-text-muted">Nota: </span>
                    <span className="text-text-base">{order.comment}</span>
                </p>
                </div>
            )}
        </div>
    );

}
